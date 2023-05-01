import express from 'express';
import UserService from 'src/service/user-service';

const router = express.Router();

router.get('/', (req, res) => {
	UserService.getAllUsers().then((users) => {
		res.send(users);
	});
});

router.get('/:id', (req, res) => {
	UserService.getUserByID(req.params.id).then((user) => {
		res.send(user);
	});
});

router.post('/', async (req, res) => {
	console.log(req.body);
	let user = {
		username: req.body.username,
		email: req.body.email,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		related_accounts: req.body.related_accounts || {},
	};

	UserService.checkUserExists(user).then(async (exists) => {
		console.log('exists', exists);
		if (exists === true) {
			res.status(200).send({ message: 'Exists' });
		} else {
			let hash = await UserService.hashPassword(req.body.password);

			let auth = {
				user_id: '',
				username: req.body.username,
				password: hash.hash,
				password_salt: hash.salt,
				iterations: hash.iterations,
			};

			res.status(200).send('Add the user');
		}
	});
});

module.exports = router;
