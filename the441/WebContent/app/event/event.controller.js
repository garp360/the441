(function() {
    'use strict';

    angular
    	.module('hb.the441')
    	.controller('EventController', EventController);
    	
    	EventController.$inject = ['$scope', '$log', 'events', 'courses'];
    	
    	function EventController ($scope, $log, events, courses) 
    	{
    		$scope.errMsg = null;
    		$scope.newEvent = false;
    		$scope.events = events;
    		$scope.event = { };
    		$scope.editMode = true;
    		$scope.pageData = { };
    		$scope.courses = courses;
    		
    		$scope.$on('newEvent', function() {
    			$scope.event = {
    				name: "",
    				date: moment().format("ddd, MMM Do, YYYY"),
    				course: $scope.courses[0],
    				teeTimes : [ ]
    			};
    			
    			$scope.pageData = {
    				availableTeeTimes : $scope.event.course.availableTeeTimes,
    				selectedCourse : $scope.event.course,
    				selectedTeeTime : $scope.event.course.availableTeeTimes[0]
    			};
    			
    			$scope.newEvent = true;
    		});
    		
    		$scope.close = close;
    		$scope.create = create;
    		$scope.onTimeSet = onTimeSet;
    		$scope.onChangeCourse = onChangeCourse;
    		$scope.addTeeTime = addTeeTime;
    		$scope.removeTeeTime = removeTeeTime;
    		
    		function close() {
    			$scope.newEvent = false;
    			$scope.errMsg = null;
    		};
    		
    		function onChangeCourse(selectedCourse) {
    			removeAllTeeTimes();
				$scope.event.course = selectedCourse;
				$scope.pageData.availableTeeTimes = selectedCourse.availableTeeTimes,
				$scope.pageData.selectedTeeTime = selectedCourse.availableTeeTimes[0];
			};
			
			function create() {
				$log.debug("EVENT = " + angular.toJson($scope.event));
			};
			
			function onTimeSet(newDate, oldDate) {
				$scope.event.date = moment(newDate).format("ddd, MMM Do, YYYY");
			};

			function addTeeTime(selectedTeeTime) {
				var scheduledTeeTimes = angular.copy($scope.event.teeTimes);
				
				if(!teeTimeIsScheduled(selectedTeeTime)) 
				{
					scheduledTeeTimes.push(selectedTeeTime);
					scheduledTeeTimes.sort(function(a,b) {
						return a.order - b.order;
					});
					$scope.event.teeTimes = scheduledTeeTimes;
				}
				$scope.pageData.selectedTeeTime = $scope.event.course.availableTeeTimes[selectedTeeTime.order + 1];
			};
			
			function teeTimeIsScheduled(selectedTeeTime) {
				var valid = false;
				angular.forEach($scope.event.teeTimes, function(teeTime) {
					if(!valid && teeTime.order === selectedTeeTime.order) {
						valid = true;
					}
				});
				
				return valid;
			};
			
			function removeTeeTime(teeTime) {
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
			};
			
			function removeAllTeeTimes() {
				// clear the events existing tee times
				$scope.event.teeTimes = [];
				
				// default to the first tee time of the selected course
				$scope.pageData.selectedTeeTime = $scope.event.course.availableTeeTimes[0];
			};
    	}
})();
