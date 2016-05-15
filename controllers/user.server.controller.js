
module.exports = {
	doLogin: function(req, res, next){
		var args = req.body;
		var userName = args.userName;
		var password = args.password;
		var verifyCode = args.verifycode;
		if(!verifyCode){
			return res.json({res:0,err:'请输入验证码'});
		}
		if(verifyCode != req.session.verifyCode && verifyCode != req.session.verifyCode.toLocaleLowerCase() && verifyCode != req.session.verifyCode.toLocaleUpperCase()){
			res.json({res:3,err:'验证码错误'});
		}
		if(!userName || !password){
			return res.json({res:0,err:'请输入用户名密码'});
		}else{
			if(userName == 'admin' && password == 'admin'){
				req.session.userName = userName;
				req.session.loginStatus = 'yes';
				return res.json({res:1,err:'登陆成功'});
			}else{
				return res.json({res:0,err:'用户名或密码错误'});
			}
		}
	},
	loginOut: function(req, res, next){
		req.session.userName = '';
		req.session.loginStatus = 'no';
		return res.json({res:1});
	},
	checkStatus: function(req, res, next){
		if(req.session.loginStatus == 'yes'){
			return res.json({res:1});
		}else{
			return res.json({res:0});
		}
	},
	verifycode: function(req, res, next){
        var codeDictionary = [0,1,2,3,4,5,6,7,8,9,
                            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var code = '';
        for (var i = 0;i < 4;i ++){
            code += codeDictionary[Math.floor(codeDictionary.length * Math.random())];
        }
        req.session.verifyCode = code;
        req.session.save();
        // console.log(code);
        return res.json({'code':code});
    }
}