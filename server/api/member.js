const router = require('express').Router();
const memberModel = require('./_model/memberModel');
const { modelCall } = require('../../util/lib');
const passport = require('passport');
const jwt = require('../plugins/jwt');

// /api/member/duplicateCheck/mb_id/abcd
// MVC 
router.get('/duplicateCheck/:field/:value', async (req, res) => {
	const result = await modelCall(memberModel.duplicateCheck, req.params)
	res.json(result);
});

// 회원가입
router.post('/', async (req, res) => {
	const result = await modelCall(memberModel.createMember, req);
	res.json(result);
})

// 로그인
router.post('/loginLocal', async (req, res) => {
	passport.authenticate('local', function (err, member, info) {
		if (info) {
			res.json({ err: info })
		} else {
			req.login(member, { session: false }, (err) => {
				if (err) {
					console.log('loginLocal', err);
					res.json({ err })
				} else {
					const token = jwt.getToken(member);
					const data = memberModel.loginMember(req);
					member.mb_login_at = data.mb_login_at;
					member.mb_login_ip = data.mb_login_ip;
					res.cookie('token', token, { httpOnly: true });
					res.json({ token, member });
				}
			})
		}
	})(req, res);
});

// 인증 
router.get('/auth', (req, res)=> {
	const member = req.user;
	const token = req.cookies.token;
	// console.log('auth', member, token);
	res.json({member, token});
});

// 로그아웃 
router.get('/signOut', (req, res)=> {
	res.clearCookie('token');
	res.json(true);
})
module.exports = router;