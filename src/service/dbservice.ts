import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri =
	process.env.MONGODB_URI || 'mongodb+srv://sma_db:admin@users.h71biob.mongodb.net/?retryWrites=true&w=majority';

console.log(uri);
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

class MongoService {
	client: MongoClient;

	constructor() {
		this.client = client;
	}

	async connect() {
		return new Promise((resolve, reject) => {
			try {
				client.connect().then(() => {
					resolve('Connected to MongoDB');
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	async disconnect() {
		return new Promise((resolve, reject) => {
			try {
				client.close().then(() => {
					resolve('Disconnected from MongoDB');
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	async getCollection(collectionName: string) {
		return await this.connect()
			.then(() => {
				return client.db('sma').collection(collectionName).find().toArray();
			})
			.finally(this.disconnect);
	}

	async getDocumentByID(collectionName: string, id: string) {
		return await this.connect()
			.then(() => {
				let objectId = new ObjectId(id);
				return client.db('sma').collection(collectionName).findOne({ _id: objectId });
			})
			.finally(this.disconnect);
	}

	async queryDocumentHasAny(collectionName: string, query: Array<object>) {
		console.log('Querying the collection ' + collectionName);
		return await this.connect().then(async () => {
			for (let i = 0; i < query.length; i++) {
				let fields = query[i];
				console.log('fields', fields);
				if (
					await client
						.db('sma')
						.collection(collectionName)
						.countDocuments(fields, { limit: 1 })
						.then((count) => {
							return count > 0;
						})
				) {
					return true;
				}
			}
			return false;
		});
	}

	async createDocument(collectionName: string, document: any) {
		return await this.connect().then(() => {
			return client
				.db('sma')
				.collection(collectionName)
				.insertOne(document)
				.then((result) => {
					return result;
				})
				.finally(this.disconnect);
		});
	}
}

export default new MongoService();
