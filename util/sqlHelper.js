const sqlHelper = {
	SelectSimple(table, data = null, cols = []) {
		let query = `SELECT * FROM ${table}`;
		const where = [];
		const values = [];

		if (data) {
			const keys = Object.keys(data);
			for (key of keys) {
				where.push(`${key}=?`);
				values.push(data[key]);
			}
			query += ` WHERE ` + where.join(' AND ');
		}

		if (cols.length > 0) {
			query = query.replace('*', cols.join(', '));
		}
		return { query, values };
	},
	Insert(table, data) {
		let query = `INSERT INTO ${table} ({1}) VALUES ({2})`;
		const keys = Object.keys(data);
		const prepare = new Array(keys.length).fill('?').join(', ');
		const values = [];
		for (const key of keys) {
			values.push(data[key]);
		}
		query = query.replace('{1}', keys.join(', '));
		query = query.replace('{2}', prepare);
		return { query, values };
	}
};

module.exports = sqlHelper;