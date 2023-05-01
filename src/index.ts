import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/users', require('./routes/users'));

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
