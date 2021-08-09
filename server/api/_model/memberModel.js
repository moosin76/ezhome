const db = require('../../plugins/mysql');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');
const { LV } = require('../../../util/level');
const moment = require('../../../util/moment');
const { getIp } = require('../../../util/lib');

async function getDefaultMemberLevel() {
	const sql = sqlHelper.SelectSimple(
		TABLE.MEMBER,
		null,
		['COUNT(*) AS cnt']
	);
	const [[{cnt}]] = await db.execute(sql.query);
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
		// console.log('createMember', req.body);
		const at = moment().format('LT');
		const ip = getIp(req);

		const payload = {
			...req.body,
			mb_level : await getDefaultMemberLevel(),
			mb_create_at : at,
			mb_create_ip : ip,
			mb_update_at : at,
			mb_update_ip : ip,
		}

		// 비밀번호 암호화
		console.log(payload);
		return payload;
	}
};

module.exports = memberModel;