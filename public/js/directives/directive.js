app.directive('mytoast',function(){
	return{
		restrict:'AECM',
		templateUrl:'/partials/toast.html',
		replace:true,
		link:function(){

		}
	}
});
app.directive('sidemenu',function(){
	return{
		restrict:'AECM',
		templateUrl:'/partials/sideMenu.html',
		replace:true,
		link:function(){
			$(document).on('click','.root-nav',function(){
				$(this).siblings('.sub-nav-item').slideToggle(300);
			});
			setTimeout(function(){
				$(".menu-label").each(function(){
					$(this).before('<em class="font-ico">'+ $(this).attr('data-icon') +'</em>');
				})
			},100);
		}
	}
});
app.directive('topheader',function(){
	return{
		restrict:'AECM',
		templateUrl:'/partials/topHeader.html',
		replace:true,
		link:function(){

		}
	}
});
app.directive('appcopyright',function(){
	return{
		restrict:'AECM',
		templateUrl:'/partials/copyright.html',
		replace:true,
		link:function(){

		}
	}
});
app.directive('checkstatus',['$http',function($http){
	return{
		restrict:'AECM',
		templateUrl:'',
		replace:true,
		link:function(){
			$http.get(
				'/checkStatus'
			).success(function (data){
				if(data.res == 0){
					window.location.href = '/login';
				}
			})
		}
	}
}]);
app.directive('personitem',function(){
	return{
		restrict:'AECM',
		templateUrl:'/partials/personItem.html',
		replace:true,
		link:function(){

		}
	}
});
app.directive('pagingitem',function(){
	return{
		restrict:'AECM',
		templateUrl:'/partials/paging.html',
		replace:true,
		link:function(){

		}
	}
});
app.directive('addpersonform',function(){
	return{
		restrict:'AECM',
		templateUrl:'/partials/addPersonForm.html',
		replace:true,
		link:function(){

		}
	}
});

// app.directive('genderline',function($compile){
// 	return{
// 		restrict:'AECM',
// 		template:'<div class="text-info clearfix"><label>性别：</label>' +
// 							'<span>' +
// 								'<select class="b-w"' +
// 								'ng-model="basic.GENDER" ' +
// 								'ng-options="library.value as library.text for library in genderLibrary">' +
// 								'</select>' +
// 							'</span>' +
// 						'</div>',
// 		replace:true,
// 		scope: {
// 	      	rawHtml: '=genderline'
// 	    },
// 		link:function(cope, elem, attrs){
// 			scope.$watch('rawHtml',function(){
// 				var newElem = $compile($.parseHTML(value))(scope.$parent);
// 		        elem.contents().remove();
// 		        elem.append(newElem);
// 			})
// 		}
// 	}
// })
app.directive('jsmind',function(){
	return{
		restrict:'AECM',
		templateUrl:'',
		replace:true,
		link:function(){
			// $(".loading-wait").show();
			var mind = {
		        "meta":{
		            "name":"userPortait",
		            "author":"loongtao",
		            "version":"1",
		        },
		        "format":"node_tree",
		        "data":{
		        	"id":"root",
		        	"topic":"禤先良",
		        	"children":[
				        {
				        	"id":"1",
				        	"topic":"个人属性",
				        	"direction":"right",
				        	"children":[
					            {"id":"11","topic":"生日","children":[
					            	{"id":"111","topic":"1984年03月17日","children":[
					            		{"id":"1111","topic":"属相","children":[
					            			{"id":"11111","topic":"鼠"}
					            		]},
					            		{"id":"1112","topic":"星座","children":[
					            			{"id":"11121","topic":"双鱼座"}
					            		]}
					            	]},
					            ]},
					            {"id":"12","topic":"性别","children":[
			            			{"id":"121","topic":"男"}
			            		]},
					            {"id":"13","topic":"照片","children":[
			            			{"id":"131","topic":"<img src='/images/userhead.jpg' width=80 height=80>"}
			            		]},
					            {"id":"14","topic":"身份证","children":[
			            			{"id":"141","topic":"3454524423432434324"},
			            			{"id":"142","topic":"发证地：广西壮族自治区玉林地区玉林市"}
			            		]},
					            {"id":"15","topic":"婚姻状态","children":[
			            			{"id":"151","topic":"已婚"}
			            		]},
					            {"id":"16","topic":"子女","children":[
			            			{"id":"161","topic":"女儿","children":[
				            			{"id":"1611","topic":"生日：2012年03月17日3"},
				            			{"id":"1612","topic":"姓名>","children":[
					            			{"id":"16121","topic":"菲菲"}
					            		]}
				            		]}
			            		]},
					            {"id":"17","topic":"国籍","children":[
			            			{"id":"171","topic":"中国"}
			            		]},
					            {"id":"18","topic":"所在地","children":[
			            			{"id":"181","topic":"广东省深圳"}
			            		]}
				        	]
				        },
				        {
				        	"id":"2",
				        	"topic":"联系方式",
				        	"direction":"right",
				        	"expanded":false,
				        	"children":[
					            {"id":"21","topic":"on GitHub"},
					            {"id":"22","topic":"BSD License"}
				           	 ]
				        },
				        {
				        	"id":"3",
				        	"topic":"学习经历",
				        	"direction":"right",
				        	"expanded":false,
				        	"children":[
					            {"id":"31","topic":"Base on Javascript"},
					            {"id":"32","topic":"Base on HTML5"},
					            {"id":"33","topic":"Depends on you"}
					        ]
					    },
				        {
				        	"id":"4",
				        	"topic":"社交",
				        	"direction":"right",
				        	"expanded":false,
				        	"children":[
					            {"id":"41","topic":"I'm from local variable"},
					            {"id":"42","topic":"I can do everything"}
					        ]
					    },
					    {
				        	"id":"5",
				        	"topic":"金融支付",
				        	"direction":"right",
				        	"expanded":false,
				        	"children":[
					            {"id":"51","topic":"Base on Javascript"},
					            {"id":"52","topic":"Base on HTML5"},
					            {"id":"53","topic":"Depends on you"}
					        ]
					    },
				        {
				        	"id":"6",
				        	"topic":"事件",
				        	"direction":"right",
				        	"expanded":false,
				        	"children":[
					            {"id":"61","topic":"I'm from local variable"},
					            {"id":"62","topic":"I can do everything"}
					        ]
					    },
					    {
				        	"id":"7",
				        	"topic":"工作履历",
				        	"direction":"right",
				        	"expanded":false,
				        	"children":[
					            {"id":"71","topic":"I'm from local variable"},
					            {"id":"72","topic":"I can do everything"}
					        ]
					    },
					    {
				        	"id":"8",
				        	"topic":"公司产品/新闻",
				        	"direction":"right",
				        	"expanded":false,
				        	"children":[
					            {"id":"81","topic":"I'm from local variable"},
					            {"id":"82","topic":"I can do everything"}
					        ]
					    }
				    ]}
		    };
		    var options = {
		        container:'portrait-content',
		        editable:false,
		        theme:'my',
		        view:{
			       line_width: 1
			   	},
			   	layout:{
			   		vspace: 12
			   	}
		    }
		    // setTimeout(function(){
		         var jm = jsMind.show(options,mind);
		         // $(".loading-wait").hide();
		     // },1000)
		   
		    // jm.set_readonly(true);
		    // var mind_data = jm.get_data();
		    // alert(mind_data);
		}
	}
});