const db = require('../../plugins/mysql');
const jwt = require('../../plugins/jwt');
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

		payload.mb_password = jwt.generatePassword(payload.mb_password);
		const sql = sqlHelper.Insert(TABLE.MEMBER, payload);
		const [row] = await db.execute(sql.query, sql.values);
				
		return row.affectedRows == 1;
	}
};

module.exports = memberModel;