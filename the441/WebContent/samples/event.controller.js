(function() {
    'use strict';

    angular
    	.module('controller.module')
    	.controller('EventController', EventController);
    	EventController.$inject = ['$scope', '$log', '$controller', '$state', '$firebaseAuth', 'EventFactory', 'courses', 'event'];
    	
    	function EventController ($scope, $log, $controller, $state, $firebaseAuth, EventFactory, courses, event) {
			angular.extend(this, $controller('AuthController', {$scope: $scope}));
			$scope.event = event;
			$scope.courses = courses;
			$scope.selectedCourse = event.course;
			$scope.selectedTeeTime = $scope.event.course.availableTeeTimes[0];
			$scope.editMode = false;
			$scope.isNew = true;
			
			$scope.onChangeCourse = onChangeCourse;
			$scope.onChangeEventDate = onChangeEventDate;
			
			$scope.displayTeeTime = displayTeeTimeInCommaDelimitedList;
			$scope.toggleEditMode = toggleEditMode;
			$scope.addTeeTime = addTeeTime;
			$scope.removeTeeTime = removeTeeTime;
			$scope.removeAllTeeTimes = removeAllTeeTimes;
			$scope.teeTimeEditorEnabled = teeTimeEditorEnabled;
			$scope.create = createEvent;
			$scope.update = updateEvent;

			
			function onChangeCourse(selectedCourse) {
				// set newly selected course in event.
				$scope.event.course = selectedCourse;
				
				removeAllTeeTimes();
			};
			
			function onChangeEventDate(selectedDate, oldDate) {
				// set date to 12am for the selected day
				var eventDate = moment(selectedDate).hour(0).minute(0).second(0);
				
				$scope.event.date = eventDate.toISOString();
			};
			
			function addTeeTime(selectedTeeTime) {
				var scheduledTeeTimes = angular.copy($scope.event.teeTimes);
				if(!teeTimeIsScheduled(selectedTeeTime)) {
					scheduledTeeTimes.push(selectedTeeTime);
					scheduledTeeTimes.sort(function(a,b){
						return a.order - b.order;
					});
					$scope.event.teeTimes = scheduledTeeTimes;
				}
				$scope.selectedTeeTime = $scope.event.course.availableTeeTimes[selectedTeeTime.order + 1];
			}; 
			
			
			function teeTimeIsScheduled(selectedTeeTime) {
				var valid = false;
				angular.forEach($scope.event.teeTimes, function(teeTime) {
					if(!valid && teeTime.order === selectedTeeTime.order) {
						valid = true;
					}
				});
				
				$log.debug("teeTimeIsScheduled = " + valid);
				return valid;
			}
			
			/*
			 * teeTime: teeTime 
			 * 		{	    order	: 0, 
			 * 			formatted 	: moment().format('hh:mm A'),
			 * 			      utc 	: moment().toISOString()
			 * 		};
			 * allTeeTimes: array of teeTimes
			 * 
			 * Function determines whether to display with comma delimiter or without
			 */
			function displayTeeTimeInCommaDelimitedList(teeTime, allTeeTimes) {
				var teeTimeToDisplay = moment(teeTime.utc).format('h:mm a');
				
				if(allTeeTimes[allTeeTimes.length-1].order != teeTime.order) {
					teeTimeToDisplay += ", ";
				}
				
				return teeTimeToDisplay;
			};
			
			function toggleEditMode(editModeState) {
				$scope.editMode = editModeState;
			};

			function teeTimeEditorEnabled() {
				return $scope.event.teeTimes.length > 0;
			};

			function removeTeeTime(teeTime) {
				if($scope.event.teeTimes.length <= 1) {
					removeAllTeeTimes();
				} else {
					var scheduledTeeTimes = [];
					angular.forEach($scope.event.teeTimes, function(scheduledTeeTime) {
						if(teeTime.order != scheduledTeeTime.order) {
							scheduledTeeTimes.push(scheduledTeeTime);
						}
					});
					
					scheduledTeeTimes.sort(function(a,b){
						return a.order - b.order;
					});
					$scope.event.teeTimes = scheduledTeeTimes;
				}
			}
			
			function removeAllTeeTimes() {
				// clear the events existing tee times
				$scope.event.teeTimes = [];

				// toggle tee time edit mode OFF
				$scope.editMode = false;
				
				// default to the first tee time of the selected course
				$scope.selectedTeeTime = $scope.event.course.availableTeeTimes[0];
			};
			
			function createEvent() {
				EventFactory.createEvent($scope.event).then(function(event){
					$scope.isNew = false;
					$scope.event = event;
					$scope.selectedTeeTime = $scope.event.course.availableTeeTimes[0];
				}, function(){
					$scope.isNew = true;
					$log.debug("Create Event Failed");
				});
			}
			
			function updateEvent() {
				EventFactory.updateEvent($scope.event).then(function(event){
					$scope.isNew = false;
					$scope.event = event;
					$scope.selectedTeeTime = $scope.event.course.availableTeeTimes[0];
				}, function(){
					$scope.isNew = true;
					$log.debug("Update Event Failed");
				});
			}
			
			
			
			
		};
})();
