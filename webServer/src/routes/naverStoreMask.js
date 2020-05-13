const express = require('express');
const miimaMaskJob = require('../mask/naverStore/miima');

const router = express.Router();

router.get('/miima', (req, res, next) => {
	const { type } = req.query;
	if (type) {
		console.log('start');
		miimaMaskJob.start();
		res.send({
			data: {
				type,
			},
		});
	} else {
		console.log('stop');
		miimaMaskJob.stop();
		res.send({
			data: {
				type,
			},
		});
	}
	next();
});

module.exports = router;
