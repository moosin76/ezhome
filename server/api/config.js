const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const configModel = require('./_model/configModel');

router.get('/', async (req, res) => {
	const result = await modelCall(configModel.getItems, req);
	res.json(result);
});

router.get('/duplicateCheck', async (req, res) => {
	const result = await modelCall(configModel.duplicateCheck, req.query);
	res.json(result);
});

router.post('/', async (req, res) => {
	const result = await modelCall(configModel.saveConfig, req);
	res.json(result);
});

router.put('/', async (req, res)=> {
	const result = await modelCall(configModel.sortUpdate, req);
	res.json(result);
})

router.delete('/:cf_key', async(req, res)=>{
	const result = await modelCall(configModel.removeConfig, req);
	res.json(result);
});

module.exports = router;