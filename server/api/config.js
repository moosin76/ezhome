const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const configModel = require('./_model/configModel');

router.get('/duplicateCheck', async (req, res) => {
	const result = await modelCall(configModel.duplicateCheck, req.query);
	res.json(result);
});

router.post('/', async (req, res) => {
	const result = await modelCall(configModel.post, req);
	res.json(result);
});
module.exports = router;