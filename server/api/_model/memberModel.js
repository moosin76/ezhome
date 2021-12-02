const fs = require('fs');
const path = require('path');

const db = require('../../plugins/mysql');
const jwt = require('../../plugins/jwt');
const sendMailer = require('../../plugins/sendMailer');

const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');
const { LV } = require('../../../util/level');
const moment = require('../../../util/moment');
const { getIp } = require('../../../util/lib');

function clearMemberField(member) {
	delete member.mb_password;
	member.mb_create_at = moment(member.mb_create_at).format('LT');
	member.mb_update_at = moment(member.mb_update_at).format('LT');
	if (member.mb_login_at) {
		member.mb_login_at = moment(member.mb_login_at).format('LT');
	}
	if (member.mb_leave_at) {
		member.mb_leave_at = moment(member.mb_leave_at).format('LT');
	}
	if (member.mb_birth) {
		member.mb_birth = moment(member.mb_birth).format('L');
	}
	return member;
}

async function getDefaultMemberLevel() {
	const sql = sqlHelper.SelectSimple(
		TABLE.MEMBER,
		null,
		['COUNT(*) AS cnt']
	);
	const [[{ cnt }]] = await db.execute(sql.query);
	return cnt == 0 ? LV.SUPER : LV.MEMBER;
}

const memberModel = {
	async duplicateCheck({ field, value }) {
		// SELECT COUNT(*) AS cnt FROM member WHERE mb_id=?;
		const sql = sqlHelper.SelectSimple(
			TABLE.MEMBER,
			{ [field]: value },
			['COUNT(*) AS cnt']
		);
		const [[row]] = await db.execute(sql.query, sql.values);
		return row;
	},
	async createMember(req) {
		const at = moment().format('LT');
		const ip = getIp(req);

		const payload = {
			...req.body,
			mb_level: await getDefaultMemberLevel(),
			mb_create_at: at,
			mb_create_ip: ip,
			mb_update_at: at,
			mb_update_ip: ip,
		}
		// 이미지 업로드 처리
		delete payload.mb_image;
		const fileName = jwt.getRandToken(16);
		if (req.files && req.files.mb_image) {
			payload.mb_photo = `/upload/memberPhoto/${fileName}.jpg`;
			req.files.mb_image.mv(`${MEMBER_PHOTO_PATH}/${fileName}.jpg`, (err) => {
				if (err) {
					console.log("Member Image Upload Error", err);
				}
			});
		}

		payload.mb_password = jwt.generatePassword(payload.mb_password);
		const sql = sqlHelper.Insert(TABLE.MEMBER, payload);
		const [row] = await db.execute(sql.query, sql.values);

		return row.affectedRows == 1;
	},
	async updateMember(req) {
		// return {body : req.body, file:req.files};
		const at = moment().format('LT');
		const ip = getIp(req);

		const payload = {
			...req.body,
			mb_update_at : at,
			mb_update_ip : ip,
		};

		const admMode = payload.admMode;
		const mb_id = payload.mb_id;
		const deleteImage = payload.deleteImage;
		delete payload.admMode;
		delete payload.mb_id;
		delete payload.deleteImage;

		// 비밀번호가 변경 해야 한다
		if(payload.mb_password) {
			payload.mb_password = jwt.generatePassword(payload.mb_password);
		} else {
			delete payload.mb_password;
		}

		// 이미지 처리
		delete payload.mb_image;
		const mb_photo = payload.mb_photo;
		const photoPathInfo = path.parse(mb_photo);
		const oldName = photoPathInfo.name;
		const oldFile = `${MEMBER_PHOTO_PATH}/${oldName}.jpg`;
		const cachePath = `${MEMBER_PHOTO_PATH}/.cache`;

		// 기존 이미지 삭제
		if(deleteImage || (req.files && req.files.mb_image)) {
			payload.mb_photo = '';
			try {
				fs.unlink(oldFile);
				const cacheDir = fs.readdirSync(cachePath);
				for(const p of cacheDir) {
					if(p.startsWith(oldName)) {
						try {
							fs.unlinkSync(`${cachePath}/${p}`);
						} catch(e) {}
					}
				}
			} catch(e) {}
		}

		// 이미지 업로드 되었으면 처리
		if(req.files && req.files.mb_image) {
			const newName = jwt.getRandToken(16);
			payload.mb_photo = `/upload/memberPhoto/${newName}.jpg`;
			const newFile = `${MEMBER_PHOTO_PATH}/${newName}.jpg`;
			req.files.mb_image.mv(newFile, (err)=>{
				if(err) {
					console.log('Member Photo 업로드 실패', err);
				}
			})
		}

		const sql = sqlHelper.Update(TABLE.MEMBER, payload, {mb_id});
		const [row] = await db.execute(sql.query, sql.values);
		return await memberModel.getMemberBy({mb_id});
	},
	async getMemberBy(form, cols = []) {
		const sql = sqlHelper.SelectSimple(TABLE.MEMBER, form, cols);
		const [[row]] = await db.execute(sql.query, sql.values);
		if (!row) {
			throw new Error('존재하지 않는 회원입니다.');
		}
		return clearMemberField(row);
	},
	loginMember(req) {
		const data = {
			mb_login_at: moment().format('LT'),
			mb_login_ip: getIp(req),
		};
		const { mb_id } = req.body;

		const sql = sqlHelper.Update(TABLE.MEMBER, data, { mb_id });
		db.execute(sql.query, sql.values);
		return data;
	},
	async findId(data) {
		const sql = sqlHelper.SelectSimple(TABLE.MEMBER, data, ['mb_id']);
		const [[row]] = await db.execute(sql.query, sql.values);
		if (!row) throw new Error('일치하는 회원이 없습니다.');
		return row;
	},
	async findPw(req) {
		// 검색을 해서 일치 하는 회원이 있는 보고
		const data = req.query;
		const sql = sqlHelper.SelectSimple(TABLE.MEMBER, data, ['mb_name']);
		const [[member]] = await db.execute(sql.query, sql.values);
		if (!member) throw new Error('일치하는 회원정보가 없습니다.');

		// sm_to, sm_type, sm_hash, sm_subject, sm_content, sm_create_at, sm_expire_at
		// 있으면 토큰 하나 발급
		const sm_hash = jwt.getRandToken(64);
		const title = 'ezCode'; // 나중에 사이트 설정갑에서 가지고 오자
		const sm_subject = `${title} 비밀번호 찾기`;
		const sm_create_at = moment().format('LT');
		const expire_at = moment().add('30', 'm');

		const hostName = req.headers['x-forwarded-host'] || req.headers.host;
		const baseUrl = `${req.protocol}://${hostName}/modifyPassword/`;

		let sm_content = fs.readFileSync(__dirname + '/findPwForm.html').toString();
		sm_content = sm_content.replace('{{name}}', member.mb_name);
		sm_content = sm_content.replace('{{time}}', expire_at.format('LLLL') + '분');
		sm_content = sm_content.replace('{{link}}', baseUrl + sm_hash);

		const sm = {
			sm_to: data.mb_email,
			sm_type: 1,
			sm_hash,
			sm_subject,
			sm_content,
			sm_create_at,
			sm_expire_at: expire_at.format('LT'),
		}

		try {
			await sendMailer(`${title} 관리자`, data.mb_email, sm_subject, sm_content);
			const smSql = sqlHelper.Insert(TABLE.SEND_MAIL, sm);
			await db.execute(smSql.query, smSql.values);
		} catch (e) {
			console.log(e);
			return { err: `email 발송에 필패 하였습니다.\n관리자에게 문의 주세요.` }
		}

		return member;
	},
	async modifyPassword(data) {
		// 유효시간이 경과된 거 삭제
		const delQuery = `DELETE FROM ${TABLE.SEND_MAIL} WHERE sm_type=1 AND sm_expire_at < NOW()`;
		await db.execute(delQuery);
		// 유효시간 안에 해쉬로 검색
		const sql = {
			query: `SELECT sm_to FROM ${TABLE.SEND_MAIL} WHERE sm_type=? AND sm_hash=? AND sm_expire_at > NOW()`,
			values: [1, data.hash],
		};
		const [[row]] = await db.execute(sql.query, sql.values);
		// 없으면 에러
		if (!row) {
			throw new Error('시간이 만료되었거나 이미 처리되었습니다.');
		}
		// 있으면 비밀번호를 변경 하고
		const mb_email = row.sm_to;
		const mb_password = await jwt.generatePassword(data.password);
		const upSql = sqlHelper.Update(TABLE.MEMBER, { mb_password }, { mb_email });
		const [upRes] = await db.execute(upSql.query, upSql.values);

		// 처리한거 삭제
		const delSql = sqlHelper.DeleteSimple(TABLE.SEND_MAIL, { sm_hash: data.hash });
		db.execute(delSql.query, delSql.values);
		return upRes.affectedRows == 1;
	},
	async loginSocial(req, data) {
		let member = null;
		const { id, provider, email, nickname, image }  = data;
		
		try {
			member = await memberModel.getMemberBy({ mb_email: email })
		} catch (e) {
			const at = moment().format('LT');
			const ip = getIp(req);
			const data = {
				mb_id: id,
				mb_password: '',
				mb_provider : provider,
				mb_name: nickname,
				mb_email: email,
				mb_photo: image,
				mb_level: await getDefaultMemberLevel(),
				mb_create_at: at,
				mb_create_ip: ip,
				mb_update_at: at,
				mb_update_ip: ip,
			};
			const sql = sqlHelper.Insert(TABLE.MEMBER, data);
			await db.execute(sql.query, sql.values);
			member = await memberModel.getMemberBy({ mb_email: email });
		}
		return member;
	},
	async socialCallback(req, res, err, member) {
		let html = fs.readFileSync(__dirname + '/socialPopup.html').toString();
		let payload = {};
		if (err) {
			payload.err = err;
		} else {
			// 토큰 만들고 쿠키 설정
			const token = jwt.getToken(member);
			req.body.mb_id = member.mb_id;
			const data = memberModel.loginMember(req);
			member.mb_login_at = data.mb_login_at;
			member.mb_login_ip = data.mb_login_ip;
			res.cookie('token', token, { httpOnly: true });
			payload.member = member;
			payload.token = token;
		}

		html = html.replace('{{payload}}', JSON.stringify(payload));
		return html;
	},
	async checkPassword(req) {
		if(!req.user) {
			throw new Error('로그인 되어 있지 않습니다.');
		}
		const data = {
			mb_id : req.user.mb_id,
			mb_password : await jwt.generatePassword(req.body.mb_password),
		};
		const sql = sqlHelper.SelectSimple(TABLE.MEMBER, data, ['COUNT(*) AS cnt']);
		const [[{cnt}]] = await db.execute(sql.query, sql.values);
		if(cnt == 0) {
			throw new Error('비밀번호가 올바르지 않습니다.');
		} else {
			return true;
		}
	}
};

module.exports = memberModel;