// toast文字提示
app.service('myToast',function(){
	this.makeToast = function(time,top){
		if(top){
			$('.toast').css({'bottom':'auto','top':top + 'px'});
		}else{
			$('.toast').css({'bottom':'25%'});
		}
		$('.toast').show();
		setTimeout(function(){
			$('.toast').hide();
		},time);
	}
});
// 侧边导航收缩
app.service('aside',function(){
	this.doAsideShrink = function(){
		if($('.app-aside').attr('data-status') == 'open'){
			$('.app-aside').attr('data-status','close');
			$('.app-aside').addClass('close-aside');
			$(".app-content").addClass('app-content-s');
			$(".hide-status").addClass('cur-status');
			$(".show-status").removeClass('cur-status');
			$('.aside-nav-item span').hide();

		}else if($('.app-aside').attr("data-status") == 'close'){
			$('.app-aside').attr('data-status','open');
			$('.app-aside').removeClass('close-aside');
			$(".app-content").removeClass('app-content-s');
			$(".show-status").addClass('cur-status');
			$(".hide-status").removeClass('cur-status');
			setTimeout(function(){
				$('.aside-nav-item span').show();
			},200);
		}
	}
});
// 全选复选框
app.service('checkOperating',function(){
	this.checkAll = function(name){
		$("input[name='"+ name +"']").each(function(){
			this.checked = true;
		});
		$("input[name='all"+ name +"']")[0].checked = true;
	},
	this.unCheckAll = function(name){
		$("input[name='"+ name +"']").each(function(){
			this.checked = false;
		});
		$("input[name='all"+ name +"']")[0].checked = false;
	},
	this.isAllChecked = function(name){
		var all = true;
		$("input[name='"+ name +"']").each(function(){
			if(this.checked == false){
				all = false;
			}
			console.log(all)
		});
		if(all){
			$("#all" + name)[0].checked = true;
		}else{
			$("#all" + name)[0].checked = false;
		}
	},
	this.isDefultChecked = function(name){
		if($("#all" + name)[0].checked == true){
			this.checkAll(name);
		}else if($("#all" + name)[0].checked == false){
			this.unCheckAll(name);
		}
	}
});
// 获取文件后缀
app.service('getFileExt',function(){
	this.getExt = function(filepath){
		//为了避免转义反斜杠出问题，这里将对其进行转换
		var re = /(\\+)/g; 
		var filename=filepath.replace(re,"#");
		var one=filename.split("#");
		var two=one[one.length-1];
		var three=two.split(".");
		var ext=three[three.length-1];
		return ext;
	}
});
// 加载中遮罩层
app.service('waitingMask',function(){
	this.showMask = function(text){
		if(text){
			$(".loadingtip-text").text(text);
		}else{
			$(".loadingtip-text").text('正在读取数据，请稍等...');
		}
		$(".loading-wait").show()
	},
	this.hideMask = function(){
		$(".loading-wait").hide();
	}
});
// 添加编辑基础信息
app.service('addBasicLine',function(){
	this.addLine = function(type,name,$scope,$compile){
		if(type == 'GENDER'){
			$('.insert-text-info').before('<genderline></genderline>');
		}else if(type == 'MARRIAGE'){

		}else{
	    	var tpl = $compile('<div class="text-info clearfix"><label>'+ name +'：</label>' +
								'<span><input type="text" class="b-w" ng-model="basicAdd.'+ type +'"></span>' +
							'</div>');
	    	var e = tpl($scope);
	    	$('.insert-text-info').before(e);
		}
	}
})