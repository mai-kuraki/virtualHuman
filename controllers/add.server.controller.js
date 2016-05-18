var db = require('../config/db.util.js');
var mysqlPool = require('../config/db.pool.js');
var async = require('async');
var formidable = require('formidable');

module.exports = {
	uploadFile: function(req, res, next){
        var form = new formidable.IncomingForm();   //创建上传表单
            form.encoding = 'utf-8';        //设置编辑
            form.uploadDir = 'public/uploads/importFiles/';     //设置上传目录
            form.keepExtensions = true;     //保留后缀
            form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
        form.parse(req, function(err, fields, files) {
        	console.log(files);
            // if (err) {
            //     console.log(err);
            //     res.end(JSON.stringify({res:false}));
            // }else{
            //     var imgPath = files.headImg.path.replace(/\\/g,"/");
            //     imgPath = imgPath.replace(/public/,"");
            // } 
            res.json({res:1});
          });
	},
    addNewHuman: function(req, res, next){
        var args = req.body;

        var sqlItem = {};
        var tasks  = [];

        var sqlBasic = 'insert into character_basic_information (';
        for(var i in args.data){
            if(args.data[i].label == 'basic'){
                sqlBasic += args.data[i].field + ','
            };
        };
        sqlBasic = sqlBasic.substr(0,sqlBasic.length - 1);
        sqlBasic += ') values (';
        for(var i in args.data){
            if(args.data[i].label == 'basic'){
                sqlBasic += '\''+ args.data[i].addFieldValue +'\',';
            }
        }
        sqlBasic = sqlBasic.substr(0,sqlBasic.length - 1);
        sqlBasic += ')';

        console.log(sqlBasic);
        

        function getSql(user_id){
            for(var i in args.data){
                if(!sqlItem[args.data[i].label]){
                    if(args.data[i].label != 'basic'){
                        tasks.push(args.data[i].label);
                    }
                    if(args.data[i].fieldLabel != ''){
                        sqlItem[args.data[i].label] = 'insert into '+ args.data[i].tableName +'( '+args.data[i].fieldLabel+','+args.data[i].field+',';
                    }
                }
            };
            for(var i in sqlItem){
                sqlItem[i] += 'USER_ID ) values ';
            }
            for(var i in args.data){
                if(args.data[i].fieldLabel != ''){
                    sqlItem[args.data[i].label] += '(\''+args.data[i].addFieldLabel+'\',\''+args.data[i].addFieldValue +'\','+ user_id +'),';
                }
            }
            for(var i in sqlItem){
                sqlItem[i] = sqlItem[i].substr(0,(sqlItem[i].length - 1));
            }
            console.log(sqlItem);
            console.log(tasks);
            extendInfo();
        }        

        var _switch = 0;
        var isErr = false;

        mysqlPool.getConnection(function(err,conn){
            if(err){
                console.log('mysql连接池获取连接错误：' + err);
                if(err.code=='ETIMEDOUT'){
                    console.log('连接超时');
                }
                return false;
            }else{
                conn.query(sqlBasic,function(err, result){
                    if(err){
                        console.log(err);
                         res.json({res:0,msg:'添加人物失败'});
                    }else{
                        conn.query('select @@identity as id',function(error,identity){
                            console.log(identity);
                            getSql(identity[0].id);
                            conn.release();
                        })
                    }
                })
            }
        });

        function extendInfo(){
            async.eachSeries(tasks, function (item, callback) {
                function sqlCallBack (err, result,args){
                    if(err){
                        isErr = true;
                    }
                    _switch += 1;
                    if(_switch == tasks.length){
                        if(isErr){
                            res.json({res:0,msg:'添加人物成功，扩展资料失败'});
                        }else{
                            res.json({res:1});
                        }
                    }
                }
                callback();
                db.doQuery(sqlItem[item],item,sqlCallBack);
            });
        }
        

        // async.eachSeries(tasks, function (item, callback) {
        //     function sqlCallBack (err, result,args){
        //         if(err){
        //             isErr = true;
        //         }
        //         _switch += 1;
        //         if(_switch == tasks.length){
        //             if(isErr){
        //                 res.json({res:0});
        //             }else{
        //                 res.json({res:1});
        //             }
        //         }
        //     }
        //     callback();
        //     db.doQuery(sqlItem[item],item,sqlCallBack);
        // });
    }
}