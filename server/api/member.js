const router = require('express').Router();
const memberModel = require('./_model/memberModel');
const { modelCall } = require('../../util/lib');
// /api/member/duplicateCheck/mb_id/abcd
// MVC 
router.get('/duplicateCheck/:field/:value', async (req, res) => {
	const result = await modelCall(memberModel.duplicateCheck, req.params)
	res.json(result);
});

router.post('/', async (req, res) =>{
	const result = await modelCall(memberModel.createMember, req);
	res.json(result);
})

module.exports = router;