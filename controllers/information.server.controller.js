var db = require('../config/db.util.js');
var async = require('async');
var url = require('url');
var formidable = require('formidable');

module.exports = {
	// 获取虚拟人详细信息
	getInformationDetail: function(req, res, next){
		var args = url.parse(req.url, true).query;
		var userID = args.id;
		console.log(userID);
		
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

		var resultData = {};
		var _switch = 0;

		// 同步执行sql;
		async.eachSeries(tasks, function (item, callback) {
			function sqlCallBack (err, result,args){
				if(result){
					resultData[args] = result;
			        _switch += 1;
			        if(_switch == tasks.length){
			        	res.json(resultData);
			        }
				}
			}
			callback();
		    db.doQuery(sqlItems[item],item,sqlCallBack);
		});
    },
    // 获取虚拟人列表
    gethumanItemData: function(req, res, next){
    	var args = url.parse(req.url, true).query;
    	var curPage = args.curPage;
    	var pageSize = args.pageSize;

		var sqlQuery = 'select ID,SINA_WEIBO,SINA_URL,NAME,GENDER,LOCATION,AGE from character_basic_information limit '+ (curPage - 1) * pageSize +',' + pageSize;
		var sqlCount = 'select count(*) from character_basic_information';
		var resultData = {};
		
		async.waterfall([
			function (callback){
				function sqlCallBack(err, result,args){
					if(result){
						callback(null,result);
					}
				};
				db.doQuery(sqlCount,null,sqlCallBack);
			},
			function (arg,callback){
				function sqlCallBack(err, result,args){
					if(result){
						resultData['itemData'] = result;
	    				res.json(resultData);
						callback();
					}else{
			    		res.json(resultData);
					}
				};
				if(arg[0]['count(*)'] && arg[0]['count(*)'] >= 1){
					var pageCount = Math.ceil(arg[0]['count(*)'] / pageSize);
	    			resultData['pageCount'] = pageCount;
	    			db.doQuery(sqlQuery,null,sqlCallBack);
				}else{
					resultData['pageCount'] = 0;
					resultData['itemData'] = [];
					res.json(resultData);
				}						
			}
		]);
			
    },
    // 获取用户画像
    getPortrait: function(req, res, next){
    	var args = url.parse(req.url, true).query;
		var userID = args.id;
		var resultData = {};

		var sql = 'select NAME,PHOTO from character_basic_information where ID=' + userID;

		async.series({
			basicInfo: function(callback){
				function sqlCallBack(err, result,args){
					if(result){
						resultData['basicInfo'] = result;
					};
					res.json(resultData);
					callback();
				};
				db.doQuery(sql,null,sqlCallBack);
			},
			portraitData: function(callback){

				callback();
			}
		});
    },
    // 获取虚拟人线索
    getClue: function(req, res, next){
    	var args = url.parse(req.url, true).query;
		var userID = args.id;
		var resultData = {};
		var sql = 'select NAME,PHOTO from character_basic_information where ID=' + userID;

		async.series({
			basicInfo: function(callback){
				function sqlCallBack(err, result,args){
					if(result){
						resultData['basicInfo'] = result;
					};
					res.json(resultData);
					callback();
				};
				db.doQuery(sql,null,sqlCallBack);
			},
			clueData: function(callback){

				callback();
			}
		});
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
    	// res.end();
    	// return;
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

		var insertItem = [
			{'tableName': 'character_contact_way','strInsert': 'contactInsert','field': 'contactAdd'},
			{'tableName': 'character_learning_experience','strInsert': 'learningInsert','field': 'learningAdd'},
			{'tableName': 'character_social_media','strInsert': 'socialInsert','field': 'socialAdd'},
			{'tableName': 'character_financial_payment','strInsert': 'paymentInsert','field': 'paymentAdd'},
			{'tableName': 'character_event','strInsert': 'eventInsert','field': 'eventAdd'}
		];

		function getUpdateSql(tableName,field){
			var strUpdate = '';
			if(args[field].length > 0){
				strUpdate = 'update '+ tableName +' set ';
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
			}
			
			return strUpdate;
		};

		for(var i in updateItem){
			sqlItems[updateItem[i].strUpdate] = getUpdateSql(updateItem[i].tableName,updateItem[i].field);
		};


		function getInsertSql(tableName,field){
			if(args[field].length > 0){
				var insertStr = 'insert into '+ tableName +' (';
				for(var i in args[field][0]){
					insertStr += i.toString() +',';
				}
				insertStr = insertStr.substr(0,(insertStr.length - 1));
				insertStr += ') values ';
				
				for(var i in args[field]){
					var tempStr = '( '
					for(var j in args[field][i]){
						if(args[field][i][j]){
							tempStr += '\''+ args[field][i][j] +'\','
						}else{
							tempStr += null +','
						}
					}
					tempStr = tempStr.substr(0, (tempStr.length - 1));
					tempStr += '),';
					insertStr += tempStr;
				}
				insertStr = insertStr.substr(0, (insertStr.length - 1));
			}else{
				insertStr = '';
			};
			
			return insertStr;
		}

		for(var i in insertItem){
			sqlItems[insertItem[i].strInsert] = getInsertSql(insertItem[i].tableName,insertItem[i].field);
		}

		// console.log(sqlItems);
		// res.end();
		// return;
		var tasks  = [];
		for(var i in sqlItems){
			if(sqlItems[i] != ''){
				tasks.push(i);
			}
		}

		var _switch = 0;
		var isErr = false;
		// 同步执行sql;
		async.eachSeries(tasks, function (item, callback) {

			function sqlCallBack(err, result, args){
				if(err){
					isErr = true;
				}
				_switch += 1;
		        if(_switch == tasks.length){
		        	if(isErr){
		        		res.json({result: 0});
		        	}else{
		        		res.json({result: 1});
		        	}
		        }	
		        callback();
			};

			db.doQuery(sqlItems[item],null,sqlCallBack);
		});
    }
}