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
    		$scope.pageData = {};
    		
    		$scope.courses = courses;
    		
    		$scope.$on('newEvent', function() {
    			$scope.event = {
    				name: "",
    				date: moment().format("ddd, MMM Do, YYYY"),
    				course: $scope.courses[0],
    				teeTimes : []
    			};
    			
    			$scope.pageData = {
    				availableTeeTimes : $scope.courses[0].availableTeeTimes,
    				selectedTeeTime : $scope.courses[0].availableTeeTimes[0]
    			};
    			
    			$scope.newEvent = true;
    		});
    		
    		$scope.close = close;
    		$scope.create = create;
    		$scope.onTimeSet = onTimeSet;
    		
    		function close() {
    			$scope.newEvent = false;
    			$scope.errMsg = null;
    		}
    		
    		function onChangeCourse(selectedCourse) {
				$scope.event.course = selectedCourse;
			};
			
			function create() {
				$log.debug("EVENT = " + $scope.event);
			}
			
			function onTimeSet(newDate, oldDate) {
				$scope.event.date = moment(newDate).format("ddd, MMM Do, YYYY");
			}
			
    	}
})();
