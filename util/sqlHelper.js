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
	}
};

module.exports = sqlHelper;