import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { connect } from 'http2';

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
		return await client.connect().then(() => {
			return client.db('sma').collection(collectionName).find().toArray();
		});
	}
}

export default new MongoService();
