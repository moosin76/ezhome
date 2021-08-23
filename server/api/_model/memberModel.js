const db = require('../../plugins/mysql');
const jwt = require('../../plugins/jwt');
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
		if(req.files && req.files.mb_image) {
			req.files.mb_image.mv(`${MEMBER_PHOTO_PATH}/${payload.mb_id}.jpg`, (err)=>{
				if(err) {
					console.log("Member Image Upload Error", err);
				}
			});
		}

		payload.mb_password = jwt.generatePassword(payload.mb_password);
		const sql = sqlHelper.Insert(TABLE.MEMBER, payload);
		const [row] = await db.execute(sql.query, sql.values);

		return row.affectedRows == 1;
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

		const sql = sqlHelper.Update(TABLE.MEMBER, data, {mb_id});
		db.execute(sql.query, sql.values);
		return data;
	}
};

module.exports = memberModel;