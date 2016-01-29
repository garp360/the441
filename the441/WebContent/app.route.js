(function() {
    'use strict';
    
    angular.module('hb.the441')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	    
		$urlRouterProvider.otherwise('/');
	 
	    $stateProvider
		
		.state('the441', {   
			url : '/',
			controller: 'AppController',
			views: {
				'': {
					templateUrl: 'app.html'
				},
				'header@the441' : {
					templateUrl: 'app/header/header.html',
					controller: 'HeaderController',
					resolve: {
						pageHeader: function(title){
							return title;
						}
					}  
				},
				'dashboard@the441' : {
					templateUrl: 'app/event/events.html',
					controller: 'EventController',
					resolve: {
						events : function(EventService) {
							return EventService.getUpcomingEvents();
						},
						courses : function() {
							return [
								{
									order : 0,
									name: "South Hampton",
									teetimeIncrement : 9
								},
								{
									order : 20,
									name: "Cimarron",
									teetimeIncrement : 8
								},
								{
									order : 10,
									name: "St Johns",
									teetimeIncrement : 10
								}
							];
						}
					}  
				},
				'footer@the441' : {
					templateUrl: 'app/footer/footer.html'
				}
			},
			authenticate: true
		})
		.state('login', {   
			url : '/login',
			templateUrl : 'app/security/login/login.html',
			controller : 'LoginController'
		})
		.state('register', 
		{
        	url:'/register/:email',
    		templateUrl: 'app/security/register/registration.html',
    		controller: 'RegistrationController',
    		resolve : {
        		registration : function($stateParams){
        	          return {email: $stateParams.email};
        	    }
        	}
		});
	}]); 
})();