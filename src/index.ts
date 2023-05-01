import express from 'express';
import dotenv from 'dotenv';
import mongoService from './service/mongo-service';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
	mongoService.getCollection('users').then((collection) => {
		res.send(collection);
	});
	// res.status(500).send('Something broke!');
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
