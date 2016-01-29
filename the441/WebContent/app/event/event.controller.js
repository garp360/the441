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
    		$scope.onTimeSet = onTimeSet;
    		
    		$scope.courses = courses;
    		
    		$scope.$on('newEvent', function() {
    			$scope.event = {
    				name: "",
    				course: $scope.courses[0]
    			}
 
    			$scope.newEvent = true;
    		});
    		
    		$scope.close = close;
    		$scope.create = create;
    		
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
				$scope.event.date = moment(newDate).format("MMM Do YYYY");
			}
			
    	}
})();
