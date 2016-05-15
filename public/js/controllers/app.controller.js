// 顶级
app.controller('appContentCtrl',['$scope','aside','$http',function($scope,aside,$http){
	$scope.asideShrink = function(){
		aside.doAsideShrink();
	}
}]);


// 顶部bar 
app.controller('topHeaderCtrl',['$scope','$http',function($scope,$http){
	$scope.loginOut = function(){
		$http.get(
			'/loginOut'
			).success(function(data){
				if(data.res == 1){
					window.location.href = '/login';
				}
			})
	}
}]);


// 侧边导航 
app.controller('asideMenuCtrl',['$scope','$http',function($scope,aside,$http){
	$scope.menuData = [
		{icon:'&#xe902;',label:'虚拟人管理',link:'',display:'block',children:[
			{icon:'&#xe901;',label:'虚拟人数据库',link:'database'},
			{icon:'&#xe900;',label:'搜索虚拟人',link:'search'},
			{icon:'&#xe550;',label:'添加虚拟人',link:'add'}
		]},
		{icon:'&#xe6c4;',label:'数据源管理',link:'',display:'none',children:[]}
	]
}]);


// 虚拟人数据库 
app.controller('databaseCtrl',['$scope','$http','checkOperating','waitingMask',function($scope,$http,checkOperating,waitingMask){
	
	$scope.inputName = 'user';
	$scope.library = [];

	$scope.$on('getItemData',function (e, data){
		waitingMask.showMask();
		var curPage = data.curPage;
		var pageSize = data.pageSize;
		$scope.library = [];
		$http.get(
			'/gethumanItemData?curPage=' + curPage + '&pageSize=' + pageSize
			).success(function (data){
				$scope.library = data.itemData;
				$scope.$broadcast('transferPagging',{pageCount:data.pageCount});
				setTimeout(function(){
					checkOperating.isDefultChecked($scope.inputName);
				},100);
				waitingMask.hideMask();
			})
	})

}]);


// 虚拟人列表 
app.controller('personItemCtrl',['$scope','checkOperating',function($scope,checkOperating){
	$scope.isAllChecked = function(name){
		checkOperating.isAllChecked(name);
	}
	$scope.checkAll = function(name, type){
		if(type == 'check'){
			checkOperating.checkAll(name);
		}else if(type == 'uncheck'){
			checkOperating.unCheckAll(name);
		}
	};
	$scope.inputCheckAll = function(name, e){
		var _this = e.target;
		if(_this.checked){
			checkOperating.checkAll(name);
		}else{
			checkOperating.unCheckAll(name);
		}
	}
}])

// 分页 
app.controller('pagingCtrl',['$scope','$http',function($scope,$http){
	$scope.curPage = 1;
	$scope.pageSize = 2;
	$scope.pageCount = 0;
	$scope.isFirst = '';
	$scope.isLast = '';
	$scope.pagingData = [];
	$scope.firstPage = function(){
		if($scope.curPage != 1){
			$scope.curPage = 1;
			$scope.toGetData();	
		}
	};
	$scope.prevPage = function(){
		if($scope.curPage > 1){
			$scope.curPage = $scope.curPage - 1;
			$scope.toGetData();	
		}
	};
	$scope.nextPage = function(){
		if($scope.curPage < $scope.pageCount){
			$scope.curPage = $scope.curPage + 1;
			$scope.toGetData();	
		}
	};
	$scope.thisPage = function(thisPage){
		if($scope.curPage != thisPage){
			$scope.curPage = thisPage;
			$scope.toGetData();	
		}
	};
	$scope.initPage = function(){
		$scope.toGetData();
	}

	$scope.toGetData = function(){
		$scope.pagingData = [];
		$scope.$emit('getItemData',{curPage: $scope.curPage,pageSize: $scope.pageSize});
	}
	
	$scope.$on('transferPagging',function (e, data){
		$scope.pageCount = data.pageCount;
		if($scope.curPage == 1){
			$scope.isFirst = 'page-disable';
		}else{
			$scope.isFirst = '';
		}
		if($scope.curPage == $scope.pageCount){
			$scope.isLast = 'page-disable';
		}else{
			$scope.isLast = '';
		}
		for(var i = 0;i < $scope.pageCount;i ++){
			var temp = {};
			temp.text = i + 1;
			temp.className = '';
			if($scope.curPage == (i + 1)){
				temp.className = 'cur-page';
			}
			$scope.pagingData.push(temp);
		}
	})
}]);


// 搜索虚拟人
app.controller('searchCtrl',['$scope','$http',function($scope,$http){

}]);


// 添加虚拟人
app.controller('addCtrl',['$scope','$http',function($scope,$http){
	$scope.pageName = 'add';
}]);


// 编辑虚拟人线索
app.controller('editClueCtrl',['$scope','$http',function($scope,$http){
	$scope.pageName = 'editClue';
}]);


// 搜索无结果
app.controller('searchNoResultCtrl',['$scope','$http',function($scope,$http){
	$scope.pageName = 'searchNoResult';
}]);


// 添加虚拟人表单
app.controller('addPersonFormCtrl',['$scope','$http',function($scope,$http){
	$scope.defaultFields = 2;
	$scope.customFields = [
		{text:'自定义字段',value:null,selected:''},
		{text:'姓名',value:1,selected:'selected'},
		{text:'生日',value:2,selected:''},
		{text:'性别',value:3,selected:''}
	];
	$scope.defaultLibrary = 1;
	$scope.personLibrary = [
		{text:'默认库',value:1,selected:'selected'},
		{text:'个人理财库',value:2,selected:''},
		{text:'贵金属库',value:3,selected:''},
		{text:'促销活动库',value:4,selected:''}
	];
}]);


//批量添加虚拟人
app.controller('batchAddCtrl',['$scope','Upload', '$timeout','getFileExt','myToast','waitingMask',function($scope,Upload,$timeout,getFileExt,myToast,waitingMask){
	$scope.defaultLibrary = 1;
	$scope.personLibrary = [
		{text:'默认库',value:1,selected:'selected'},
		{text:'个人理财库',value:2,selected:''},
		{text:'贵金属库',value:3,selected:''},
		{text:'促销活动库',value:4,selected:''}
	];
	$scope.toastText = '';
	$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.fileName = '';
        if(file[0]){
        	$scope.fileName = file[0].name;
        	var ext = getFileExt.getExt($scope.fileName);
        	if(ext != 'csv' && ext != 'xls' && ext != 'xlsx'){
        		$scope.toastText = '只支持Excel、CSV文件';
				myToast.makeToast(1500,300);
        		$scope.f = null;
        		$scope.fileName = '';
        		return false;        	
        	}
        }
    };
    $scope.importFile = function(){
    	if ($scope.f && $scope.f.length > 0) {
    		waitingMask.showMask('正在导入中，请稍等...');
            $scope.f.upload = Upload.upload({
                url: '/batchAdd',
                data: {file: $scope.f}
            });
            $scope.f.upload.then(function (response) {
                $timeout(function () {
                    $scope.f.result = response.data;
                    if(response.data.res == 1){
                    	waitingMask.hideMask();
                    	$scope.toastText = '导入成功';
						myToast.makeToast(1500,300);
                    }
                });
            }, function (response) {
                if (response.status > 0)
                	waitingMask.hideMask();
                    $scope.errorMsg = response.status + ': ' + response.data;
                	$scope.toastText = $scope.errorMsg;
					myToast.makeToast(1500,300);
            });
        }else{
        	$scope.toastText = '请先选择要导入的文件';
			myToast.makeToast(1500,300);
        }  
    }
}]);


//虚拟人详情
app.controller('informationDetailCtrl',['$scope','$http','waitingMask','$stateParams',function($scope,$http,waitingMask,$stateParams){
	
	$scope.id = $stateParams.id;
	$scope.basic;
	$scope.contact;
	$scope.learning;
	$scope.social;
	$scope.payment;
	$scope.event;
	$scope.label;

	$scope.initInformation = function(){
		waitingMask.showMask();
		$http.get(
			'/getInformationDetail?id=' + $scope.id
			).success(function (data){
				$scope.basic = data.basic[0];
				$scope.contact = data.contact;
				$scope.learning = data.learning;
				$scope.social = data.social;
				$scope.payment = data.payment;
				$scope.event = data.event;
				$scope.label = data.label;
				waitingMask.hideMask();
				// console.log(data)
			})
	}
	
}]);


//编辑虚拟人详情
app.controller('editInformationCtrl',['$scope','$http','waitingMask','$stateParams','getFileExt','myToast','Upload', '$timeout','addBasicLine','$compile','$state',function($scope,$http,waitingMask,$stateParams,getFileExt,myToast,Upload,$timeout,addBasicLine,$compile,$state){
	
	$scope.id = $stateParams.id;
	$scope.basic;
	$scope.contact;
	$scope.learning;
	$scope.social;
	$scope.payment;
	$scope.event;
	$scope.label;
	$scope.panel = false;

	$scope.basicAdd = {USER_ID:$scope.id};
	$scope.basicType = 'NAME';
	$scope.basicAddVal = '';
	$scope.basicMap = {
		NAME:'姓名',
		GENDER:'性别',
		NATION:'民族',
		BLOOD_TYPE:'血型',
		ID_NUMBER:'身份证',
		NATIONALITY:'国籍',
		MARRIAGE:'婚姻'
	}
	$scope.basicLibrary = [
		{text:'姓名',value:'NAME'},
		{text:'性别',value:'GENDER'},
		{text:'民族',value:'NATION'},
		{text:'血型',value:'BLOOD_TYPE'},
		{text:'身份证',value:'ID_NUMBER'},
		{text:'国籍',value:'NATIONALITY'},
		{text:'婚姻',value:'MARRIAGE'}
	];

	$scope.addBasic = function(){
		if($scope.basicAddVal != ''){
			$scope.basicAdd[$scope.basicType] = $scope.basicAddVal;
			addBasicLine.addLine($scope.basicType,$scope.basicMap[$scope.basicType],$scope,$compile);
			$scope.basicAddVal = '';
			$scope.basicType = 'NAME';
			console.log($scope.basicAdd)			
		}else{
			$scope.toastText = '请先输入值';
			myToast.makeToast(1500,300);
		}
    };

	$scope.contactAdd = [];
	$scope.contactType = '手机';
	$scope.contactAddVal = '';
	$scope.contactLibrary = [
		{text:'手机',value:'手机'},
		{text:'邮箱',value:'邮箱'},
		{text:'地址',value:'地址'},
		{text:'即时通讯',value:'即时通讯'}
	];

	$scope.addContact = function(){
		if($scope.contactAddVal != ''){
			var temp = {USER_ID:$scope.id};
			temp.CONTACT = $scope.contactAddVal;
			temp.TYPE = $scope.contactType;
			$scope.contactAdd.push(temp);
			$scope.contactAddVal = '';
			$scope.contactType = '手机';
		}else{
			$scope.toastText = '请先输入联系方式';
			myToast.makeToast(1500,300);
		}
    };

	$scope.learningAdd = [];
	$scope.learningType = '小学';
	$scope.learningAddVal = '';
	$scope.learningLibrary = [
		{text:'小学',value:'小学'},
		{text:'中学',value:'中学'},
		{text:'高中',value:'高中'},
		{text:'大学',value:'大学'},
		{text:'培训',value:'培训'},
		{text:'学历',value:'学历'}
	];

	$scope.addLearning = function(){
		if($scope.learningAddVal != ''){
			var temp = {USER_ID:$scope.id};
			temp.SCHOOL_NAME = $scope.learningAddVal;
			temp.MAJOR_GRADE = $scope.learningType;
			$scope.learningAdd.push(temp);
			$scope.learningAddVal = '';
			$scope.learningType = '小学';
		}else{
			$scope.toastText = '请先输入学习经历';
			myToast.makeToast(1500,300);
		}
    };

	$scope.socialAdd = [];
	$scope.socialType = '微信';
	$scope.socialNick = '';
	$scope.socialTime = '';
	$scope.socialLibrary = [
		{text:'微信',value:'微信'},
		{text:'大众点评网',value:'大众点评网'},
		{text:'领英',value:'领英'},
		{text:'QQ空间',value:'QQ空间'},
		{text:'新浪微博',value:'新浪微博'},
		{text:'腾讯微博',value:'腾讯微博'},
		{text:'facebook',value:'facebook'}
	];

	$scope.addSocial = function(){
		if($scope.socialNick != ''){
			var temp = {USER_ID:$scope.id};
			temp.MEDIA_NAME = $scope.learningType;
			temp.NICK_NAME = $scope.socialNick;
			temp.REGISTRATION_TIME = $scope.socialTime;
			$scope.socialAdd.push(temp);
			$scope.socialNick = '';
			$scope.socialTime = '';
			$scope.socialType = '微信';
		}else{
			$scope.toastText = '请先输入昵称';
			myToast.makeToast(1500,300);
		}
    };

	$scope.paymentAdd = [];
	$scope.paymentType = '支付宝';
	$scope.paymentAddVal = '';
	$scope.paymentLibrary = [
		{text:'支付宝',value:'支付宝'},
		{text:'财付通',value:'财付通'}
	];

	$scope.addPayment = function(){
		if($scope.paymentAddVal != ''){
			var temp = {USER_ID:$scope.id};
			temp.PAYMENT_ACCOUNT = $scope.paymentAddVal;
			temp.PAYMENT_PLATFORM = $scope.paymentType;
			$scope.paymentAdd.push(temp);
			$scope.paymentAddVal = '';
			$scope.paymentType = '支付宝';
			// console.log($scope.paymentAdd)
		}else{
			$scope.toastText = '请先输入账号';
			myToast.makeToast(1500,300);
		}
	}

	$scope.eventAdd = [];
	$scope.eventTime = '';
	$scope.eventContent = '';
	$scope.addEvent = function(){
		if($scope.eventTime != '' && $scope.eventContent != ''){
			var temp = {USER_ID:$scope.id};
			temp.TIME = $scope.eventTime;
			temp.EVENT_CONTENT = $scope.eventContent;
			$scope.eventAdd.push(temp);
			$scope.eventTime = '';
			$scope.eventContent = '';
		}else{
			$scope.toastText = '请先输入事件事件及内容';
			myToast.makeToast(1500,300);
		}
	}

	$scope.genderLibrary = [
		{text:'男',value:'男'},
		{text:'女',value:'女'}
	];

	$scope.marriageLibrary = [
		{text:'已婚',value:'已婚'},
		{text:'未婚',value:'未婚'}
	];

	$scope.initInformation = function(){
		waitingMask.showMask();
		$http.get(
			'/getInformationDetail?id=' + $scope.id
			).success(function (data){
				console.log(data)
				$scope.basic = data.basic[0];
				$scope.contact = data.contact;
				$scope.learning = data.learning;
				$scope.social = data.social;
				$scope.payment = data.payment;
				$scope.event = data.event;
				$scope.label = data.label;
				waitingMask.hideMask();
				// console.log(data)
			})
	};

    $scope.cutPicPanel = function(){
    	$scope.panel = true;
    };

    $scope.hidePanel = function(){
    	$scope.panel = false;
    };

    $scope.confrimUpload = function (dataUrl, name) {
        Upload.upload({
            url: '/editHeadPic',
            data: {
                headImg: Upload.dataUrltoBlob(dataUrl, name)
            },
        }).then(function (response) {
            $timeout(function () {
                $scope.result = response.data;
                if(response.data.res == 1){
                	$scope.basic.PHOTO = response.data.imgPath;
                	$scope.hidePanel();
                	$scope.toastText = '上传成功';
					myToast.makeToast(1500,300);
					// console.log($scope.basic)
                }else{
                	$scope.hidePanel();
                }
                // console.log(response.data)
            });
        }, function (response) {
            if (response.status > 0) $scope.errorMsg = response.status 
                + ': ' + response.data;
        });
    };

	$scope.saveEdit = function(){
		waitingMask.showMask('保存数据中，请稍等...');
		$http.post(
				'/saveInformation',
				{
					id: $scope.id,
					basic: $scope.basic,
					contact: $scope.contact,
					learning: $scope.learning,
					social: $scope.social,
					payment: $scope.payment,
					event: $scope.event,
					contactAdd: $scope.contactAdd,
					learningAdd: $scope.learningAdd,
					socialAdd: $scope.socialAdd,
					paymentAdd: $scope.paymentAdd,
					eventAdd: $scope.eventAdd,
				}
			).success(function (data){
				waitingMask.hideMask();
				if(data.result == 1){
					$scope.toastText = '保存成功';
					myToast.makeToast(1500,300);
					setTimeout(function(){
						$state.go('information',{id:$scope.id});
					},1500);
					
				}else if(data.result == 0){
					$scope.toastText = '部分数据保存失败';
					myToast.makeToast(1500,300);
				}
			})

	};
	
}]);

// 虚拟人画像
app.controller('portraitCtrl',['$scope','$stateParams','$http',function($scope,$stateParams,$http){
	$scope.id = $stateParams.id;
	$scope.basicInfo = {};
	$scope.initData = function(){
		$http.get(
			'/getPortrait?id=' + $scope.id
			).success(function (data){
				$scope.basicInfo = data.basicInfo[0];
			})
	}
}]);


// 虚拟人线索
app.controller('clueCtrl',['$scope','$stateParams','$http',function($scope,$stateParams,$http){
	$scope.id = $stateParams.id;
	$scope.basicInfo = {};
	$scope.initData = function(){
		$http.get(
			'/getClue?id=' + $scope.id
			).success(function (data){
				$scope.basicInfo = data.basicInfo[0];
			})
	}
}]);
