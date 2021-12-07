const db = require('../../plugins/mysql');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');
const { LV, isGrant } = require('../../../util/level');

const configModel = {
	async load() {
		const sql = sqlHelper.SelectSimple(TABLE.CONFIG, null, ['cf_key', 'cf_val', 'cf_client', 'cf_type']);
		const [rows] = await db.execute(sql.query, sql.values);
		global.$config = {
			server : {},
			client : {}
		};
		for(const row of rows) {
			this.setConfigItem(row);
		}
	},
	setConfigItem(item) {
		configModel.clearConfigItem(item.cf_key);
		if(item.cf_type == 'Json') {
			item.cf_val = JSON.parse(item.cf_val);
		}
		if(item.cf_client) {
			$config.client[item.cf_key] = item.cf_val;	
		} else {
			$config.server[item.cf_key] = item.cf_val;
		}
	},
	clearConfigItem(cf_key) {
		delete $config.server[cf_key];
		delete $config.client[cf_key];
	},
	async duplicateCheck({ field, value }) {
		const sql = sqlHelper.SelectSimple(
			TABLE.CONFIG,
			{ [field]: value },
			['COUNT(*) as cnt']
		);
		const [[row]] = await db.execute(sql.query, sql.values);
		return row;
	},
	async getItems(req) {
		const { all } = req.query;
		let where = {};
		if (all == 'true') {
			// 권한 확인
			if (!isGrant(req, LV.ADMIN)) {
				throw new Error('관리자 설정 목록 권한이 없습니다.');
			}
			const sort = {
				cf_group: true,
				cf_sort: true,
			};
			const sql = sqlHelper.SelectSimple(TABLE.CONFIG, where, [], sort);
			const [rows] = await db.execute(sql.query, sql.values);
			return rows;
		} else {
			return $config.client;
		};
		
	},
	async saveConfig(req) {
		const data = req.body;
		const sql = sqlHelper.InsertOrUpdate(TABLE.CONFIG, data);
		const [row] = await db.execute(sql.query, sql.values);
		configModel.setConfigItem(data);
		return data;
	},
	async sortUpdate(req) {
		req.body.forEach((item) => {
			const { cf_key, cf_sort } = item;
			const sql = sqlHelper.Update(TABLE.CONFIG, { cf_sort }, { cf_key });
			db.execute(sql.query, sql.values);
		});
		return true;
	},
	async removeConfig(req) {
		if (!isGrant(req, LV.SUPER)) {
			throw new Error('최고관리자만 삭제가 가능합니다.');
		}
		const { cf_key } = req.params;
		const sql = sqlHelper.DeleteSimple(TABLE.CONFIG, { cf_key });
		const [row] = await db.execute(sql.query, sql.values);
		configModel.clearConfigItem(cf_key);
		return row.affectedRows == 1;
	}
};

module.exports = configModel;