var mysql = require('mysql');
var properties = require('./db.properties.js').mysql;

module.exports = function(){
	var pool = mysql.createPool({
			host: properties.host,
			user: properties.user,
			password: properties.password,
			database: properties.database
		});
	console.log('----------mysql连接池创建成功----------');
	return pool;
}();