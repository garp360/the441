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
						courseData : function() {
		        			var courseData = [ {id: 'crs1', name: 'Cimarrone', patronage : 'SEMI-PRIVATE', order : 2, teeTimeInterval: 8, teeTimeStart: 7, availableTeeTimes: []},                  
		        			 		 {id: 'crs2', name: 'St Johns', patronage : "SEMI-PRIVATE", order : 1, teeTimeInterval: 10, teeTimeStart: 7, availableTeeTimes: []},
		        			 		 {id: 'crs3', name: 'South Hampton', patronage : "SEMI-PRIVATE", order : 0, teeTimeInterval: 9, teeTimeStart: 7, availableTeeTimes: []}
		        			];
		        			courseData.sort(function(a,b) {
								return a.order - b.order;
							});
		        			return courseData;
		        		},
		        		courses : function (courseData) {
		        			
		        	    	angular.forEach(courseData, function(course){
		        	    		var firstTime =  moment().hour(course.teeTimeStart).minute(0).second(0);
		        	    		var firstTeeTime = {
		        	    			order: 0,
		        	    			formatted : firstTime.format('hh:mm A'),
		        	    			simple: firstTime.format('h:mm A'),
		        	    			utc : firstTime.toISOString()
		        	    		};
		        	    		
		        	    		course.availableTeeTimes.push(firstTeeTime);
		        	    		for(var i=0; i<70; i++) {
		        	    			var priorTeeTime = moment(course.availableTeeTimes[i].utc);
		        	    			var nextTime = priorTeeTime.add(course.teeTimeInterval, 'm');
		        	    			var nextTeeTime = {
		        	    				order: i+1,
	    	        	    			formatted : nextTime.format('hh:mm A'),
	    	        	    			simple: nextTime.format('h:mm A'),
	    	        	    			utc : nextTime.toISOString()
		    	        	    	};
		        	    			course.availableTeeTimes.push(nextTeeTime);	        	    			
		        	    		}
		        	    	});
		        	    	
		        	    	return courseData;
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