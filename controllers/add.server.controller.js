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
	}
}