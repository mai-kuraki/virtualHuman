// 顶级
app.controller('appContentCtrl',['$scope','aside','$http','$rootScope',function($scope,aside,$http,$rootScope){
	$scope.asideShrink = function(){
		aside.doAsideShrink();
	}
	$rootScope.pageSize = 5;
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
app.controller('databaseCtrl',['$scope','$http','checkOperating','waitingMask','$rootScope',function($scope,$http,checkOperating,waitingMask,$rootScope){
	
	$scope.inputName = 'user';
	$scope.library = [];

	$scope.applyData = function(curPage,pageSize){
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
	};

	$scope.applyData(1,$rootScope.pageSize);

	$scope.$on('getItemData',function (e, data){
		waitingMask.showMask();
		var curPage = data.curPage;
		var pageSize = data.pageSize;
		$scope.library = [];
		$scope.applyData(curPage,pageSize);
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
app.controller('pagingCtrl',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	$scope.curPage = 1;
	$rootScope.pageCount = 0;
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
		if($scope.curPage < $rootScope.pageCount){
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

	$scope.toGetData = function(){
		$scope.pagingData = [];
		$scope.$emit('getItemData',{curPage: $scope.curPage,pageSize: $scope.pageSize});
	}
	
	$scope.$on('transferPagging',function (e, data){
		$rootScope.pageCount = data.pageCount;
		if($scope.curPage == 1){
			$scope.isFirst = 'page-disable';
		}else{
			$scope.isFirst = '';
		}
		if($scope.curPage == $rootScope.pageCount){
			$scope.isLast = 'page-disable';
		}else{
			$scope.isLast = '';
		}
		for(var i = 0;i < $rootScope.pageCount;i ++){
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
app.controller('searchCtrl',['$scope','$http','waitingMask','myToast','$state','$rootScope',function($scope,$http,waitingMask,myToast,$state,$rootScope){
	$rootScope.conditionItem = [
		{conditionName:'姓名',conditionValue:''}
	];
	$scope.defaultSearch = '姓名';
	$scope.defaultAddSearch = '姓名';
	$scope.conditionAddValue = '';
	$scope.searchLibrary = [
		{text:'姓名',group:'------个人属性------'},
		{text:'性别',group:'------个人属性------'},
		{text:'民族',group:'------个人属性------'},
		{text:'血型',group:'------个人属性------'},
		{text:'身份证',group:'------个人属性------'},
		{text:'国籍',group:'------个人属性------'},
		{text:'婚姻',group:'------个人属性------'},
		{text:'手机',group:'------联系方式------'},
		{text:'邮箱',group:'------联系方式------'},
		{text:'地址',group:'------联系方式------'},
		{text:'小学',group:'------学习经历------'},
		{text:'中学',group:'------学习经历------'},
		{text:'高中',group:'------学习经历------'},
		{text:'大学',group:'------学习经历------'},
		{text:'培训',group:'------学习经历------'},
		{text:'学历',group:'------学习经历------'},
		{text:'微信',group:'------社交媒体------'},
		{text:'大众点评网',group:'------社交媒体------'},
		{text:'领英',group:'------社交媒体------'},
		{text:'QQ空间',group:'------社交媒体------'},
		{text:'新浪微博',group:'------社交媒体------'},
		{text:'腾讯微博',group:'------社交媒体------'},
		{text:'facebook',group:'------社交媒体------'}
	];
	$scope.conditionMap = {
		'姓名':{table:'character_basic_information',fieldLabel:'',field:'NAME',label:'basic'},
		'性别':{table:'character_basic_information',fieldLabel:'',field:'GENDER',label:'basic'},
		'民族':{table:'character_basic_information',fieldLabel:'',field:'NATION',label:'basic'},
		'血型':{table:'character_basic_information',fieldLabel:'',field:'BLOOD_TYPE',label:'basic'},
		'身份证':{table:'character_basic_information',fieldLabel:'',field:'ID_NUMBER',label:'basic'},
		'国籍':{table:'character_basic_information',fieldLabel:'',field:'NATIONALITY',label:'basic'},
		'婚姻':{table:'character_basic_information',fieldLabel:'',field:'MARRIAGE',label:'basic'},
		'手机':{table:'character_contact_way',fieldLabel:'TYPE',field:'CONTACT',label:'contact'},
		'邮箱':{table:'character_contact_way',fieldLabel:'TYPE',field:'CONTACT',label:'contact'},
		'地址':{table:'character_contact_way',fieldLabel:'TYPE',field:'CONTACT',label:'contact'},
		'小学':{table:'character_learning_experience',fieldLabel:'MAJOR_GRADE',field:'DISCRIPTION',label:'learning'},
		'中学':{table:'character_learning_experience',fieldLabel:'MAJOR_GRADE',field:'DISCRIPTION',label:'learning'},
		'高中':{table:'character_learning_experience',fieldLabel:'MAJOR_GRADE',field:'DISCRIPTION',label:'learning'},
		'大学':{table:'character_learning_experience',fieldLabel:'MAJOR_GRADE',field:'DISCRIPTION',label:'learning'},
		'培训':{table:'character_learning_experience',fieldLabel:'MAJOR_GRADE',field:'DISCRIPTION',label:'learning'},
		'学历':{table:'character_learning_experience',fieldLabel:'MAJOR_GRADE',field:'DISCRIPTION',label:'learning'},
		'微信':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'},
		'大众点评网':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'},
		'领英':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'},
		'QQ空间':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'},
		'新浪微博':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'},
		'腾讯微博':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'},
		'facebook':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'}
	};

	$rootScope.defaultVirtual = '默认库';
	$scope.virtualLibrary = [
		{text:'默认库',value:'默认库'},
		{text:'个人理财库',value:'个人理财库'},
		{text:'贵金属库',value:'贵金属库'},
		{text:'促销活动库',value:'促销活动库'},
	];

	$scope.addCondition = function(){
		var temp = {};
		temp.conditionName = $scope.defaultAddSearch;
		temp.conditionValue = $scope.conditionAddValue;
		$rootScope.conditionItem.push(temp);
		$scope.defaultAddSearch = '姓名';
		$scope.conditionAddValue = '';
	};

	$scope.toSearch = function(){
		waitingMask.showMask('查询中，请稍后...');
		for(var i in $rootScope.conditionItem){
			var tableName = $scope.conditionMap[$rootScope.conditionItem[i].conditionName].table;
			var field = $scope.conditionMap[$rootScope.conditionItem[i].conditionName].field;
			var fieldLabel = $scope.conditionMap[$rootScope.conditionItem[i].conditionName].fieldLabel;
			var label = $scope.conditionMap[$rootScope.conditionItem[i].conditionName].label;
			$rootScope.conditionItem[i].tableName = tableName;
			$rootScope.conditionItem[i].field = field;
			$rootScope.conditionItem[i].fieldLabel = fieldLabel;
			$rootScope.conditionItem[i].label = label;
		}
		$http.post(
				'/searchByCondition',
				{
					condition:$rootScope.conditionItem,
					virtualLibrary:$rootScope.defaultVirtual,
					pageSize:$rootScope.pageSize,
					curPage:1
				}
			).success(function (data){
				waitingMask.hideMask();
				// console.log(data);
				if(data.res == 0){
					$scope.toastText = '查找失败，系统错误';
					myToast.makeToast(1500,300);
				}else if(data.res == 1){
					$rootScope.itemData = data.itemData;
					$rootScope.pageCount = data.pageCount;
					$state.go('searchResult');
				}else if(data.res == 2){
					$state.go('searchNoResult');
				}
			})
	}
}]);


// 搜索新人结果(有结果)
app.controller('searchResultCtrl',['$scope','$rootScope','waitingMask','$http','checkOperating',function($scope,$rootScope,waitingMask,$http,checkOperating){
	$scope.inputName = 'user';
	$scope.library = $rootScope.itemData;

	$scope.applyData = function(curPage,pageSize){
		$http.post(
			'/searchByCondition',
			{
				condition:$rootScope.conditionItem,
				virtualLibrary:$rootScope.defaultVirtual,
				pageSize:pageSize,
				curPage:curPage
			}
			).success(function (data){
				$scope.library = data.itemData;
				$scope.$broadcast('transferPagging',{pageCount:data.pageCount});
				setTimeout(function(){
					checkOperating.isDefultChecked($scope.inputName);
				},100);
				waitingMask.hideMask();
			})
	};

	$scope.applyData(1,$rootScope.pageSize);

	$scope.$on('getItemData',function (e, data){
		waitingMask.showMask();
		var curPage = data.curPage;
		$scope.library = [];
		$scope.applyData(curPage,$rootScope.pageSize)
	});
}]);


// 搜索无结果
app.controller('searchNoResultCtrl',['$scope','$http','$rootScope','waitingMask','myToast',function($scope,$http,$rootScope,waitingMask,myToast){
	$scope.pageName = 'searchNoResult';
	$scope.iniFormData = $rootScope.conditionItem;
	$scope.initForm = function(){
		$scope.$broadcast('receiveInitData',{data:$scope.iniFormData});
	};

	$scope.$on('receiveData',function(e,data){
		console.log(data.data)
		$http.post(
			'/addNewHuman',
			{data:data.data}
			).success(function (data){
				waitingMask.hideMask();
				if(data.res == 1){
					$scope.toastText = '添加虚拟人成功';
					myToast.makeToast(1500,300);
				}else{
					$scope.toastText = data.msg;
					myToast.makeToast(1500,300);
				}
			})
	});
	$scope.toAdd = function(){
		$scope.$broadcast('toSubmit');
	}
	

}]);


// 添加虚拟人
app.controller('addCtrl',['$scope','$http','$rootScope','waitingMask','myToast',function($scope,$http,$rootScope,waitingMask,myToast){
	$scope.pageName = 'add';
	$scope.initForm = function(){
		$scope.$broadcast('receiveInitData',{data:$scope.iniFormData});
	};
	$scope.$on('receiveData',function(e,data){
		console.log(data.data)
		$http.post(
			'/addNewHuman',
			{data:data.data}
			).success(function (data){
				waitingMask.hideMask();
				if(data.res == 1){
					$scope.toastText = '添加虚拟人成功';
					myToast.makeToast(1500,300);
				}else{
					$scope.toastText = data.msg;
					myToast.makeToast(1500,300);
				}
			})
	});
	$scope.toAdd = function(){
		$scope.$broadcast('toSubmit');
	}
}]);


// 编辑虚拟人线索
app.controller('editClueCtrl',['$scope','$http',function($scope,$http){
	$scope.pageName = 'editClue';
}]);





// 添加虚拟人表单
app.controller('addPersonFormCtrl',['$scope','$http','myToast','waitingMask',function($scope,$http,myToast,waitingMask){
	$scope.defaultFields = '生日';
	$scope.customFields = [
		{text:'自定义字段',value:null},
		{text:'生日',value:'生日'},
		{text:'性别',value:'性别'}
	];
	$scope.defaultLibrary = 1;
	$scope.personLibrary = [
		{text:'默认库',value:1},
		{text:'个人理财库',value:2},
		{text:'贵金属库',value:3},
		{text:'促销活动库',value:4}
	];

	$scope.name = '';
	$scope.phone = '';
	$scope.email = '';
	$scope.idNumber = '';
	$scope.QQ = '';
	$scope.wechat = '';
	$scope.sinaNick = '';
	$scope.customVal = '';

	$scope.fieldLabel = ['姓名','手机号','电子邮箱','身份证号','QQ号','微信号','新浪微博昵称'];
	$scope.fieldItem = [];

	$scope.fieldMap = {
		'姓名':{table:'character_basic_information',fieldLabel:'',field:'NAME',label:'basic'},
		'身份证号':{table:'character_basic_information',fieldLabel:'',field:'ID_NUMBER',label:'basic'},
		'生日':{table:'character_basic_information',fieldLabel:'',field:'BIRTHDAY',label:'basic'},
		'性别':{table:'character_basic_information',fieldLabel:'',field:'GENDER',label:'basic'},
		'手机号':{table:'character_contact_way',fieldLabel:'TYPE',field:'CONTACT',label:'contact'},
		'电子邮箱':{table:'character_contact_way',fieldLabel:'TYPE',field:'CONTACT',label:'contact'},
		'QQ号':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'},
		'微信号':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'},
		'新浪微博昵称':{table:'character_social_media',fieldLabel:'MEDIA_NAME',field:'NICK_NAME',label:'social'}
	};

	$scope.$on('toSubmit',function(e){
		waitingMask.showMask('保存中，请稍后...');
		for(var i in $scope.fieldItem){
			var tableName = $scope.fieldMap[$scope.fieldItem[i].addFieldLabel].table;
			var field = $scope.fieldMap[$scope.fieldItem[i].addFieldLabel].field;
			var fieldLabel = $scope.fieldMap[$scope.fieldItem[i].addFieldLabel].fieldLabel;
			var label = $scope.fieldMap[$scope.fieldItem[i].addFieldLabel].label;
			$scope.fieldItem[i].tableName = tableName;
			$scope.fieldItem[i].field = field;
			$scope.fieldItem[i].fieldLabel = fieldLabel;
			$scope.fieldItem[i].label = label;
		}
		$scope.$emit('receiveData',{data:$scope.fieldItem});
	});

	$scope.$on('receiveInitData',function(e,data){
		console.log(data);
		for(var i in $scope.fieldLabel){
			$scope.v = '';
			for(var j in data.data){
				console.log(data.data[j].conditionName+'----------'+$scope.fieldLabel[i]);
				if($scope.fieldLabel[i].indexOf(data.data[j].conditionName) > -1){
					$scope.v = data.data[j].conditionValue;
				}
			}
			var temp = {};
			temp.addFieldLabel = $scope.fieldLabel[i];
			temp.addFieldValue = $scope.v;
			$scope.fieldItem.push(temp);
		}
	});

	$scope.addNewFeild = function(){
		// console.log($scope.fieldItem);
		for(var i in $scope.fieldItem){
			if($scope.fieldItem[i].addFieldLabel == $scope.defaultFields){
				$scope.toastText = '该字段已存在';
				myToast.makeToast(1500);
				return false;
			}
		}
		if(!$scope.customVal){
			$scope.toastText = '请先输入值';
			myToast.makeToast(1500);
			return false;
		}
		var temp = {};
		temp.addFieldLabel = $scope.defaultFields;
		temp.addFieldValue = $scope.customVal;
		$scope.fieldItem.push(temp);
		$scope.defaultFields = '生日';
		$scope.customVal = '';
	}
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
			temp.DISCRIPTION = $scope.learningAddVal;
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
			temp.MEDIA_NAME = $scope.socialType;
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
