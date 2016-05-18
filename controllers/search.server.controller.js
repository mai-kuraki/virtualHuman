var db = require('../config/db.util.js');
var async = require('async');
var url = require('url');

module.exports = {
	searchByCondition: function(req, res, next){
		var args = req.body;
		console.log(args);
		var pageSize = args.pageSize;
		var curPage = args.curPage;

		// res.end()
		// 	return false;
		var sqlQuery = 'select basic.* from character_basic_information basic ';
		var sqlCount = 'select count(*) from character_basic_information basic ';

		var tableItem = {};

		for(var i in args.condition){
			var tableName = args.condition[i].tableName;
			var conditionValue = args.condition[i].conditionValue;
			var conditionField = args.condition[i].field;
			var label = args.condition[i].label;
			if(conditionValue != '' && label != 'basic'){
				if(!tableItem[tableName]){
					tableItem[tableName] = label;
					sqlQuery += 'left join '+ tableName +' '+ label +' on '+ label +'.USER_ID = basic.ID ';
					sqlCount += 'left join '+ tableName +' '+ label +' on '+ label +'.USER_ID = basic.ID ';
				};
			}
		}
		sqlQuery += 'where ';
		sqlCount += 'where ';

		for(var i in args.condition){
			var fieldName = args.condition[i].conditionName;
			var conditionValue = args.condition[i].conditionValue;
			var fieldLabel = args.condition[i].fieldLabel;
			var conditionField = args.condition[i].field;
			var label = args.condition[i].label;
			if(label != 'basic'){
				sqlQuery += ' '+label+'.'+conditionField+' like \'%'+conditionValue+'%\' and '+label+'.'+fieldLabel+' like \'%'+fieldName+'%\' and';
				sqlCount += ' '+label+'.'+conditionField+' like \'%'+conditionValue+'%\' and '+label+'.'+fieldLabel+' like \'%'+fieldName+'%\' and';
			}else{
				sqlQuery += ' '+label+'.'+conditionField+' like \'%'+conditionValue+'%\' and';
				sqlCount += ' '+label+'.'+conditionField+' like \'%'+conditionValue+'%\' and';
			}
		}
		sqlQuery = sqlQuery.substr(0,(sqlQuery.length - 3));
		sqlQuery = sqlQuery + ' limit '+ (curPage - 1) * pageSize +',' + pageSize;
		sqlCount = sqlCount.substr(0,(sqlCount.length - 3));
		console.log(sqlQuery);
		console.log(sqlCount);
		// res.end()
		// 	return false;

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
						resultData['res'] = 1;
	    				res.json(resultData);
						callback();
					}else{
						resultData['res'] = 0;
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
					resultData['res'] = 2;
					res.json(resultData);
				}						
			}
		]);
	}
}