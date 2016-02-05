(function() {
    'use strict';

    angular
    	.module('hb.the441')
    	.factory('EventService', EventService);

    	EventService.$inject = ['$q', '$log', '$state', '$firebaseArray', '$firebaseObject'];
    
    	function EventService($q, $log, $state, $firebaseArray, $firebaseObject) 
    	{
			var factory = {};
			var memberRef = new Firebase("https://441.firebaseio.com/member");
			var eventRef = new Firebase("https://441.firebaseio.com/event");

			factory.save = save;
			factory.getUpcomingEvents = getUpcomingEvents;

			function getUpcomingEvents(credentials) 
			{
				var deferred = $q.defer();

				$firebaseArray(eventRef).$loaded().then(function(events) {					
					deferred.resolve(events);
				}).catch(function(errMsg){
					deferred.reject(errMsg);
				});
				
				return deferred.promise;
			}

			function save(event) 
			{
				var deferred = $q.defer();
				var onComplete = function(error) {
				  if (error) {
					  deferred.reject(errMsg);
				  } else {
					  deferred.resolve(getUpcomingEvents());
				  }
				};
				
				eventRef.push(event, onComplete);
				
				return deferred.promise;
			}
			
			return factory;
    	};
})();

