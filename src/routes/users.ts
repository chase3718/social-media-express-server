import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.send('Users route');
});

module.exports = router;
