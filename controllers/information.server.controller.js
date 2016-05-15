var mysqlPool = require('../config/db.util.js');
var async = require('async');
var url = require('url');
var formidable = require('formidable');

module.exports = {
	// 获取虚拟人详细信息
	getInformationDetail: function(req, res, next){
		var args = url.parse(req.url, true).query;
		var userID = args.id;
		console.log(userID);
		mysqlPool.getConnection(function(err,conn){
			if(err){
				console.log('mysql连接池获取连接错误：' + err);
				if(err.code=='ETIMEDOUT'){
					console.log('连接超时');
				}
				res.end();
			}else{

				var sqlItems = {
					'basic': 'select * from character_basic_information where ID = ' + userID,
					'contact': 'select * from character_contact_way where USER_ID = ' + userID,
					'learning': 'select * from character_learning_experience where USER_ID = ' + userID,
					'social': 'select * from character_social_media where USER_ID = ' + userID,
					'payment': 'select * from character_financial_payment where USER_ID = ' + userID,
					'event': 'select * from character_event where USER_ID = ' + userID,
					'label': 'select * from character_label where USER_ID = ' + userID
				};

				var tasks  = ['basic','contact','learning','social','payment','event','label'];

				var result = {};
				var _switch = 0;
				// 同步执行sql;
				async.eachSeries(tasks, function (item, callback) {
				    conn.query(sqlItems[item], function (err, rows) {
				    	if (err) console.log(err);
				        result[item] = rows;
				        callback();
				        _switch += 1;
				        if(_switch == tasks.length){
				        	res.json(result);
				        	conn.release();
				        }	
				    });
				});
			}
		});
    },
    // 获取虚拟人列表
    gethumanItemData: function(req, res, next){
    	var args = url.parse(req.url, true).query;
    	var curPage = args.curPage;
    	var pageSize = args.pageSize;

    	mysqlPool.getConnection(function(err,conn){
			if(err){
				console.log('mysql连接池获取连接错误：' + err);
				if(err.code=='ETIMEDOUT'){
					console.log('连接超时');
				}
				res.end();
			}else{
				var sqlQuery = 'select ID,SINA_WEIBO,SINA_URL,NAME,GENDER,LOCATION,AGE from character_basic_information limit '+ (curPage - 1) * pageSize +',' + pageSize;
				var sqlCount = 'select count(*) from character_basic_information';
				var result = {};
				
				conn.query(sqlCount, function (err, rows){
			    	if (err) console.log(err);
			    	if(rows[0]['count(*)'] && rows[0]['count(*)'] > 1){
			    		var pageCount = Math.ceil(rows[0]['count(*)'] / pageSize);
			    		result['pageCount'] = pageCount;
			    		conn.query(sqlQuery, function (error, rowss){
			    			if (error) console.log(error);
			    			// console.log(rowss);
			    			result['itemData'] = rowss;
			    			res.json(result);
			    			conn.release();
			    		})
			    	}else{
			    		result['pageCount'] = 0;
			    		result['itemData'] = [];
			    		res.json(result);
		    			conn.release();
			    	}
			    });
			}
		})
    },
    // 获取用户画像
    getPortrait: function(req, res, next){
    	var args = url.parse(req.url, true).query;
		var userID = args.id;
		mysqlPool.getConnection(function(err,conn){
			if(err){
				console.log('mysql连接池获取连接错误：' + err);
				if(err.code=='ETIMEDOUT'){
					console.log('连接超时');
				}
				res.end();
			}else{
				var result = {};
				async.series({
					basicInfo: function(callback){
						var sql = 'select NAME,PHOTO from character_basic_information where ID=' + userID;
						conn.query(sql, function (err, rows){
							result['basicInfo'] = rows;
							res.json(result);
						})
						callback();
					},
					portraitData: function(callback){

						callback();
					}
				});
			}
		})
    },
    // 获取虚拟人线索
    getClue: function(req, res, next){
    	var args = url.parse(req.url, true).query;
		var userID = args.id;
		mysqlPool.getConnection(function(err,conn){
			if(err){
				console.log('mysql连接池获取连接错误：' + err);
				if(err.code=='ETIMEDOUT'){
					console.log('连接超时');
				}
				res.end();
			}else{
				var result = {};
				async.series({
					basicInfo: function(callback){
						var sql = 'select NAME,PHOTO from character_basic_information where ID=' + userID;
						conn.query(sql, function (err, rows){
							result['basicInfo'] = rows;
							res.json(result);
						})
						callback();
					},
					clueData: function(callback){

						callback();
					}
				});
			}
		})
    },
    // 上传头像
    editHeadPic: function(req, res, next){
    	var form = new formidable.IncomingForm();   //创建上传表单
            form.encoding = 'utf-8';        //设置编辑
            form.uploadDir = 'public/uploads/userHead/';     //设置上传目录
            form.keepExtensions = true;     //保留后缀
            form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
        form.parse(req, function(err, fields, files) {
        	console.log(files);
        	
            if (err) {
                console.log(err);
                res.json({res:0});
            }else{
                var imgPath = files.headImg.path.replace(/\\/g,'/');
        		imgPath = imgPath.replace(/public/,'');
        		res.json({res:1,imgPath:imgPath});
            } 
            
          });
    },
    // 保存修改信息
    saveInformation: function(req, res, next){
    	var args = req.body;
    	// console.log(args);
    	console.log('------------------------')

		var basicUpdate = 'update character_basic_information set ' +
					  	'NAME = \''+ args.basic.NAME +'\',' +
						'ID_NUMBER = \''+ args.basic.ID_NUMBER +'\',' +
						'GENDER = \''+ args.basic.GENDER +'\',' +
						'MARRIAGE = \''+ args.basic.MARRIAGE +'\',' +
						'NATIONALITY = \''+ args.basic.NATIONALITY +'\',' +
						'LOCATION = \''+ args.basic.LOCATION +'\',' +
						'BIRTHDAY = \''+ args.basic.BIRTHDAY +'\',' +
						'PHOTO = \''+ args.basic.PHOTO +'\',' +
						'ID_ADDRESS = \''+ args.basic.ID_ADDRESS +'\' where ID = ' + args.basic.ID;

		var sqlItems = {basicUpdate: basicUpdate};

		var updateItem = [
			{'tableName': 'character_contact_way','strUpdate': 'contactUpdate','field': 'contact'},
			{'tableName': 'character_learning_experience','strUpdate': 'learningUpdate','field': 'learning'},
			{'tableName': 'character_social_media','strUpdate': 'socialUpdate','field': 'social'},
			{'tableName': 'character_financial_payment','strUpdate': 'paymentUpdate','field': 'payment'},
			{'tableName': 'character_event','strUpdate': 'eventUpdate','field': 'event'}
		];

		function getSql(tableName,field){
			var strUpdate = 'update '+ tableName +' set ';
			var condition = '';
			for(var i in args[field][0]){
				if(i != 'ID'){
					strUpdate += i +' = case ID ';
					var str = '';
					for(var j in args[field]){
						if(args[field][j][i]){
							if(/^\d+$/.test(args[field][j][i])){
								str += ' when '+ args[field][j].ID +' then '+ args[field][j][i];
							}else{
								str += ' when '+ args[field][j].ID +' then \''+ args[field][j][i] +'\'';
							}
						}else{
							str += ' when '+ args[field][j].ID +' then '+ null;
						}
						
						
					}
					str += ' end ,'
					strUpdate += str;
				}
			}
			strUpdate = strUpdate.substr(0,(strUpdate.length - 1));

			for(var i in args[field]){
				condition += args[field][i].ID +',';
			}
			strUpdate += ' where ID in (' + condition.substr(0,(condition.length - 1)) + ')';
			return strUpdate;
		};

		for(var i in updateItem){
			sqlItems[updateItem[i].strUpdate] = getSql(updateItem[i].tableName,updateItem[i].field);
		}
		// console.log(sqlItems);
		// res.end();
		// return;

		mysqlPool.getConnection(function(err,conn){
			if(err){
				console.log('mysql连接池获取连接错误：' + err);
				if(err.code=='ETIMEDOUT'){
					console.log('连接超时');
				}
				res.end();
			}else{
				var tasks  = ['basicUpdate','contactUpdate','learningUpdate','socialUpdate','paymentUpdate','eventUpdate'];

				var _switch = 0;
				var isErr = false;
				// 同步执行sql;
				async.eachSeries(tasks, function (item, callback) {
				    conn.query(sqlItems[item], function (err, rows) {
				    	if (err){
				    		console.log(err);
				    		isErr = true;
				    	} 
				        callback();
				        _switch += 1;
				        if(_switch == tasks.length){
				        	if(isErr){
				        		res.json({result: 0});
				        	}else{
				        		res.json({result: 1});
				        	}
				        	conn.release();
				        }	
				    });
				});
			}
		});
    }
}