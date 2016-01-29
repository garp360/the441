(function() {
    'use strict';
    
    angular.module('hb.the441')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	    
		$urlRouterProvider.otherwise('/');
	 
	    $stateProvider
		.state('login', {   
			url : '/login',
			templateUrl: 'app/sec/login.html',
			controller: 'LoginController',
			pageHeader: 'Login',
			authenticate: false
		})
		.state('register', {   
			url : '/register',
			templateUrl: 'app/sec/register.html',
			controller: 'RegistrationController',
			pageHeader: 'Register',
			authenticate: false
		});
	}]); 
})();