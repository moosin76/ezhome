require('dotenv').config();
const mysql = require('mysql2');

function createDatabase() {
	let instance = null;
	return {
		getInstance : function() {
			if(instance == null) {
				const config = {
					host : process.env.DB_HOST,
					user : process.env.DB_USER,
					database : process.env.DB_DATABASE,
					password : process.env.DB_PASSWORD,
				}
				const pool = mysql.createPool(config);
				instance = pool.promise();
			}
			return instance;
		}
	}
}

module.exports = createDatabase().getInstance();