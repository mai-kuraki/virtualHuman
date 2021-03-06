var app = angular.module('app',['ui.router','ngFileUpload','ngImgCrop']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('database')
	$stateProvider.state('database',{
		url:'/database',
		templateUrl:'/partials/database.html',
	}).state('portrait',{
		url:'/database/portrait?id',
		templateUrl:'/partials/portrait.html',
	}).state('information',{
		url:'/database/information?id',
		templateUrl:'/partials/information.html',
	}).state('clue',{
		url:'/database/clue?id',
		templateUrl:'/partials/clue.html',
	}).state('editInformation',{
		url:'/database/editInformation?id',
		templateUrl:'/partials/editInformation.html',
	}).state('search',{
		url:'/search',
		templateUrl:'/partials/search.html',
	}).state('add',{
		url:'/add',
		templateUrl:'/partials/add.html',
	}).state('batchAdd',{
		url:'/batchAdd',
		templateUrl:'/partials/batchAdd.html',
	}).state('batchAddResult',{
		url:'/batchAddResult',
		templateUrl:'/partials/batchAddResult.html',
	}).state('editClue',{
		url:'/editClue',
		templateUrl:'/partials/editClue.html',
	}).state('searchResult',{
		url:'/searchResult',
		templateUrl:'/partials/searchResult.html',
	}).state('searchNoResult',{
		url:'/searchNoResult',
		templateUrl:'/partials/searchNoResult.html',
	}).state('other',{
		url:'/other',
		templateUrl:'/partials/err.html',
	})
}])