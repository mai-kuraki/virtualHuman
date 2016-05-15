app.controller('loginPanel',['$scope','myToast','$http',function($scope,myToast,$http){
	// 用户名
	$scope.userName = '';
	// 密码
	$scope.password = '';
	// 验证码
	$scope.verifycode = '';
	// toast提示文字
	$scope.toastText = '';
	// 登陆提交
	$scope.submit = function(){
		if($scope.verifyData()){
			$http.post(
				'/doLogin',
				{userName:$scope.userName,password:$scope.password,verifycode:$scope.verifycode}
				).success(function (data){
					if(data.res == 0){
						$scope.toastText = data.err;
						myToast.makeToast(1500);
					}else if(data.res == 3){
						$scope.toastText = data.err;
						myToast.makeToast(1500);
						$scope.getVerifycode();
					}else if(data.res == 1){
						window.location.href = '/';
					}
				})
		}
	};
	// 验证登陆表单是否填写完整 
	$scope.verifyData = function(){
		if(!$scope.userName || !$scope.password){
			$scope.toastText = '请输入用户名密码';
			myToast.makeToast(1500);
			return false;
		}else{
			if(!$scope.verifycode){
				$scope.toastText = '请输入验证码';
				myToast.makeToast(1500);
				return false;
			}else{
				return true;
			}
		}
	};
	// 响应回车键提交
	$scope.keyboardEvent = function(e){
		var keycode = window.event?e.keyCode:e.which;
		if(keycode == 13){
			$scope.submit();
		}
	};
	// 检测登陆状态
	$scope.checkStatus = function(){
		$http.get(
			'/checkStatus'
			).success(function(data){
				if(data.res == 1){
					window.location.href = '/';
				}
			})
	};
	// 获取验证码
	$scope.getVerifycode = function(){
		$http.get(
			'/verifycode'
			).success(function (data){
				var colorItem = ['#34495E','#1BBC9D','#2A80B9'];
				var sizeItem = [50,55,60,65,70,75,80,85,90,95];
				var rotateItem = [1,2,-1,-2,1.5,-1.5,1.3,-1.3];
				var verifycode = data.code;
				var canvas = document.getElementById('canvas');
				var ctx = canvas.getContext('2d');
				ctx.beginPath();
				ctx.clearRect(0,0,500,500);
				for(var i = 0;i < verifycode.length;i++){
					ctx.font = ''+ sizeItem[Math.floor(sizeItem.length * Math.random())] +'px Microsoft YaHei';
					ctx.fillStyle = colorItem[Math.floor(colorItem.length * Math.random())];
					ctx.rotate(rotateItem[Math.floor(rotateItem.length * Math.random())]*Math.PI/180);
					ctx.fillText(verifycode[i],(45 * (i + 1) + 20),100);
					ctx.lineWidth = 5 * Math.random();
					ctx.strokeStyle = colorItem[Math.floor(colorItem.length * Math.random())];
					ctx.beginPath();
					ctx.moveTo(50*Math.random(),50*Math.random());
					ctx.quadraticCurveTo(300*Math.random(),180*Math.random(),300*Math.random(),150*Math.random());
					ctx.stroke();
				}
			})
	}
}])