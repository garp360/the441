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
			factory.update = update;
			factory.signUp = addMember;
			factory.dropOut = removeMember;
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
			
			function update(updatedEvent) 
			{
				var deferred = $q.defer();
				$firebaseObject(eventRef.child(updatedEvent.$id)).$loaded().then(function(event){
					event.course = updatedEvent.course;
					event.name = updatedEvent.name;
					event.date = updatedEvent.date;
					event.teeTimes = updatedEvent.teeTimes;
					event.members = updatedEvent.members;
					return event.$save();
				}).then(function(event){
					deferred.resolve(event);
				}).catch(function(errMsg){
					deferred.reject(errMsg);
				});
				return deferred.promise;
			}
			
			function addMember(event, member) 
			{
				return manageEventMembers(event, member.uid, member);
			}
			
			function removeMember(event, member) 
			{
				return manageEventMembers(event, member.uid, null);
			}
			
			function manageEventMembers(event, memberId, member) {
				var deferred = $q.defer();
				var onComplete = function(error) {
					if (error) {
						deferred.reject(errMsg);
					} else {
						var success = member == null ? "Removed" : "Added";
						deferred.resolve(success);
					}
				};
				eventRef.child(event.$id).child("members").child(memberId).set(member, onComplete);
				return deferred.promise;
			}
			
			return factory;
    	};
})();

