var mysqlPool = require('../config/db.pool.js');

module.exports = {
	doQuery: function(sql, args, callback){
		mysqlPool.getConnection(function(err,conn){
			if(err){
				console.log('mysql连接池获取连接错误：' + err);
				if(err.code=='ETIMEDOUT'){
					console.log('连接超时');
				}
				return false;
			}else{
				conn.query(sql,function(err, result){
					if(err){
						console.log(err);
					}
					callback.apply(null,[err,result,args]);
					conn.release();
				})
			}
		});
	}
};


