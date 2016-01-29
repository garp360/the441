(function() {
    'use strict';

    angular
    	.module('controller.module')
    	.controller('SignUpController', SignUpController);
    	SignUpController.$inject = ['$scope', '$controller', '$log', 'EventFactory', 'events', 'user'];
    	
    	function SignUpController ($scope, $controller, $log, EventFactory, events, user) {
    		angular.extend(this, $controller('AuthController', {$scope: $scope}));
			$scope.events = events;
			$scope.isAdmin = user.role != null && user.role === 'ADMIN';
			
			$scope.eventDate = eventDate;
			$scope.participantCount = participantCount;
			$scope.isParticipant = isParticipant;

			$scope.addParticipant = addParticipant;
			$scope.removeParticipant = removeParticipant;
			$scope.displayTeeTimes = displayTeeTimeInCommaDelimitedList;
			$scope.deleteEvent = deleteEvent;
			
			function eventDate(event) {
				var formattedDate = moment(event.date).format("ddd, MMM Do YYYY");
				return formattedDate;
			};

			function participantCount(event) {
				var count = 0;
				if(event.participants) {
					for ( var property in event.participants) {
						if (event.participants.hasOwnProperty(property)) {
							count += 1;
						}
					}
				}
				return count;
			};
			
			function displayTeeTimeInCommaDelimitedList(teeTime, allTeeTimes) {
				var teeTimeToDisplay = moment(teeTime.utc).format('h:mm a');
				
				if(allTeeTimes[allTeeTimes.length-1].order != teeTime.order) {
					teeTimeToDisplay += ", ";
				}
				
				return teeTimeToDisplay;
			};
			
			function isParticipant(event) {
				return event.participants && event.participants[user.$id];
			};
			
			function addParticipant(event) {
				EventFactory.addPlayer(event, user);				
			};

			function removeParticipant(event) {
				EventFactory.removePlayer(event, user);				
			};

			function deleteEvent(event) {
				EventFactory.deleteEvent(event).then(function(events){
					$scope.events = events;
				});				
			};

		};
})();