const sqlHelper = {
	SelectSimple(table, data = null, cols = [], sort = null) {
		let query = `SELECT * FROM ${table}`;
		const where = [];
		const values = [];

		if (data) {
			const keys = Object.keys(data);
			for (key of keys) {
				where.push(`${key}=?`);
				values.push(data[key]);
			}
			if (where.length > 0) {
				query += ` WHERE ` + where.join(' AND ');
			}
		}

		if (cols.length > 0) {
			query = query.replace('*', cols.join(', '));
		}

		if (sort) {
			let sorts = [];
			const keys = Object.keys(sort);
			for (const key of keys) {
				sorts.push(key + (sort[key] ? ' ASC ' : ' DESC '))
			}
			if (sorts.length) {
				query += ` ORDER BY ` + sorts.join(', ');
			}
		}
		return { query, values };
	},
	SelectLimit(table, options, cols = []) {
		// 검색
		let where = "";
		let whereArr = [];
		if (options.stf && options.stx && options.stc) {
			for (let i in options.stf) {
				const field = options.stf[i];
				const text = options.stx[i];
				const compare = options.stc[i];
				if (field) {
					switch (compare) {
						case 'lt':
							whereArr.push(` ${field}<'${text}' `);
							break;
						case 'lte':
							whereArr.push(` ${field}<='${text}' `);
							break;
						case 'eq':
							whereArr.push(` ${field}='${text}' `);
							break;
						case 'gte':
							whereArr.push(` ${field}>='${text}' `);
							break;
						case 'gt':
							whereArr.push(` ${field}>'${text}' `);
							break;
						case 'ne':
							whereArr.push(` ${field}!='${text}' `);
							break;
						case 'null':
							whereArr.push(` ${field} IS NULL `);
							break;
						case 'not':
							whereArr.push(` ${field} IS NOT NULL `);
							break;
						default:
							whereArr.push(` ${field} LIKE '%${text}%' `);
							break;
					}
				}
			}
		}
		if (whereArr.length) {
			where = ` WHERE ` + whereArr.join(' AND ');
		}
		// 정렬
		let order = "";
		let orderArr = [];
		if (options.sortBy && options.sortDesc) {
			for (let i in options.sortBy) {
				let sort = options.sortBy[i];
				let desc = options.sortDesc[i];
				if (typeof (desc) == 'boolean') {
					sort += desc ? " ASC " : " DESC ";
				} else {
					sort += desc == 'true' ? " ASC " : " DESC ";
				}
				orderArr.push(sort);
			}
		}
		if (orderArr.length) {
			order = " ORDER BY " + orderArr.join(', ');
		}

		// 페이지 네이션
		let limit = "";
		if (options.page && options.itemsPerPage) {
			const start = (options.page - 1) * options.itemsPerPage;
			limit = ` limit ${start}, ${options.itemsPerPage}`
		}

		// 쿼리
		let query = `SELECT * FROM ${table} ${where} ${order} ${limit}`;
		if (cols.length) {
			query = query.replace('*', cols.join(', '));
		}

		// 전체 아이템 개수
		let countQuery = `SELECT COUNT(*) AS totalItems FROM ${table} ${where}`;

		return { query, countQuery };
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
	},
	InsertOrUpdate(table, data) {
		let query = `INSERT INTO ${table} ({1}) VALUES ({2}) ON DUPLICATE KEY UPDATE {3}`;
		const keys = Object.keys(data);
		const prepare = new Array(keys.length).fill('?').join(', ');
		const values = [];
		const sets = [];
		for (const key of keys) {
			values.push(data[key]);
			sets.push(`${key}=?`);
		}
		query = query.replace('{1}', keys.join(', '));
		query = query.replace('{2}', prepare);
		query = query.replace('{3}', sets.join(', '));
		return { query, values: values.concat(values) };
	},
	Update(table, data, where) {
		let query = `UPDATE ${table} SET {1} WHERE {2}`;
		const keys = Object.keys(data);
		const sets = [];
		const values = [];
		for (const key of keys) {
			sets.push(`${key}=?`);
			values.push(data[key]);
		}
		query = query.replace('{1}', sets.join(', '));

		const keys2 = Object.keys(where);
		const wheres = [];
		for (const key of keys2) {
			wheres.push(`${key}=?`);
			values.push(where[key]);
		}
		query = query.replace('{2}', wheres.join(' AND '));
		return { query, values };
	},
	DeleteSimple(table, data) {
		let query = `DELETE FROM ${table}`;
		const where = [];
		const values = [];

		if (data) {
			const keys = Object.keys(data);
			for (key of keys) {
				where.push(`${key}=?`);
				values.push(data[key]);
			}
			query += ` WHERE ` + where.join(' AND ');
		} else {
			throw new Error('DELETE 구문에는 WHERE절이 있어야 합니다.');
		}

		return { query, values };
	},
};

module.exports = sqlHelper;