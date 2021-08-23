const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('./jwt');
const memberModel = require('../api/_model/memberModel');

module.exports = (app) => {
	app.use(passport.initialize());

	passport.use(new LocalStrategy(
		{
			usernameField : 'mb_id',
			passwordField : 'mb_password'
		},
		async (mb_id, mb_password, done) => {
			try {
				mb_password = jwt.generatePassword(mb_password);
				const member = await memberModel.getMemberBy({mb_id, mb_password});
				return done(null, member);
			} catch(e) {
				console.log(e.message);
				return done(null, null, '아이디 또는 비밀번호가 올바르지 않습니다.');
			}
		}
	))
}