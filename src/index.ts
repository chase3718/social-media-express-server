import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
	res.send(process.env.NODE_ENV);
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
