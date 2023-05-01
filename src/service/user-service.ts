import { ObjectId } from 'mongodb';
import * as crypto from 'crypto';
import mongoService from './dbservice';

const PASSWORD_LENGTH = 256;
const SALT_LENGTH = 64;
const ITERATIONS = 10000;
const DIGEST = 'sha256';
const BYTE_TO_STRING_ENCODING = 'hex';

interface PersistedPassword {
	salt: string;
	hash: string;
	iterations: number;
}

type userSchema = {
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	related_accounts: object;
};

type authSchema = {
	// _id: ObjectId;
	user_id: string;
	username: string;
	password: string;
	password_salt: string;
	iterations: number;
};

class UserService {
	public getAllUsers() {
		return mongoService.getCollection('users').then((users) => {
			return users;
		});
	}

	public getUserByID(id: string) {
		return mongoService.getDocumentByID('users', id).then((user) => {
			return user;
		});
	}

	public addUser(user: userSchema, auth: authSchema) {
		mongoService.createDocument('users', user).then((result) => {
			let userId = result.insertedId.toString();
			auth.user_id = userId;
			return mongoService.createDocument('auth', auth).then((result) => {
				return 'User added succesfully';
			});
		});
	}

	public hashPassword(password: string) {
		return new Promise<PersistedPassword>((resolve, reject) => {
			const salt = crypto.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING);
			crypto.pbkdf2(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (error, hash) => {
				if (error) {
					return reject(error);
				}

				resolve({
					salt,
					hash: hash.toString(BYTE_TO_STRING_ENCODING),
					iterations: ITERATIONS,
				});
			});
		});
	}

	public verifyPassword(persistedPassword: PersistedPassword, passwordAttempt: string): Promise<boolean> {
		return new Promise<boolean>((accept, reject) => {
			crypto.pbkdf2(
				passwordAttempt,
				persistedPassword.salt,
				persistedPassword.iterations,
				PASSWORD_LENGTH,
				DIGEST,
				(error, hash) => {
					if (error) {
						return reject(error);
					}

					accept(persistedPassword.hash === hash.toString(BYTE_TO_STRING_ENCODING));
				}
			);
		});
	}

	public checkUserExists(user: userSchema) {
		let queries = [{ username: user.username }, { email: user.email }];
		return mongoService.queryDocumentHasAny('users', queries).then((result) => {
			return result;
		});
	}
}

export default new UserService();
