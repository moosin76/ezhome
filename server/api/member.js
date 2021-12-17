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
});

// 회원정보수정
router.patch('/', async (req, res) => {
	const result = await modelCall(memberModel.updateMember, req);
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
router.get('/auth', (req, res) => {
	const member = req.user;
	const token = req.cookies.token;
	res.json({ member, token });
});

// 로그아웃 
router.get('/signOut', (req, res) => {
	res.clearCookie('token');
	res.json(true);
});

// 아이디찾기
router.get('/findId', async (req, res) => {
	const result = await modelCall(memberModel.findId, req.query);
	res.json(result);
});

// 비밀번호 찾기
router.get('/findPw', async (req, res) => {
	const result = await modelCall(memberModel.findPw, req);
	res.json(result);
});

// 비밀번호 변경
router.patch('/modifyPassword', async (req, res) => {
	const result = await modelCall(memberModel.modifyPassword, req.body);
	res.json(result);
});

// 구글 로그인 요청
router.get('/loginGoogle', passport.authenticate('google', {
	scope: ['email', 'profile']
}));
// 카카오 로그인 요청
router.get('/loginKakao', passport.authenticate('kakao'));
// 네이버 로그인 요청
router.get('/loginNaver', passport.authenticate('naver'));

router.get('/social-callback/:provider', (req, res) => {
	const provider = req.params.provider
	passport.authenticate(provider, async function (err, member) {
		// console.log(member);
		// res.json(member);
		const result = await modelCall(memberModel.socialCallback, req, res, err, member);
		res.end(result);
	})(req, res);
})

// 비밀번호 확인
router.post('/checkPassword', async (req, res) => {
	const result = await modelCall(memberModel.checkPassword, req);
	res.json(result);
})

router.get('/', async (req, res) => {
	const result = await modelCall(memberModel.getMembers, req);
	res.json(result);
})
module.exports = router;