(function() {
    'use strict';

    angular
    	.module('hb.the441')
    	.controller('EventController', EventController);
    	
    	EventController.$inject = ['$scope', '$log', 'member', 'events', 'courses', 'EventService'];
    	
    	function EventController ($scope, $log, member, events, courses, EventService) 
    	{
    		$scope.errMsg = null;
    		$scope.newEvent = false;
    		$scope.events = events;
    		$scope.event = { };
    		$scope.editMode = true;
    		$scope.pageData = { };
    		$scope.courses = courses;
    		$scope.member = member;
    		$scope.isSignedUp = isSignedUp;
    		
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
    		$scope.formatTeeTimes = formatTeeTimes;
    		$scope.playerCount = playerCount;
    		$scope.signUp = signUp;
    		$scope.dropOut = dropOut;
    		
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
				var event = angular.copy($scope.event);
				event.course = {
					id: event.course.id,
					name: event.course.name
				};
				var teetimes = [];
				angular.forEach(event.teeTimes, function(teeTime) {
					teetimes.push({
						order: teeTime.order,
						utc: teeTime.utc
					});
				})
				event.teeTimes = teetimes;
				
				$log.debug("EVENT = " + angular.toJson(event));
				EventService.save(event).then(function(event){
					close();
				}, function(errMsg){
					$scope.errMsg = errMsg;
				});
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
			
			function formatTeeTimes(event) {
				var teeTimes = "";
				if(event.teeTimes && event.teeTimes.length > 0) {
					
					for(var i=0; i<event.teeTimes.length; i++) {
						if(i>0) {
							teeTimes = teeTimes + ", ";
						}
						teeTimes = teeTimes + moment(event.teeTimes[i].utc).format('h:mma');
					}
				}
				return teeTimes;
			}
			
			function isSignedUp(event) {
				return event != null && event.members != null && event.members[$scope.member.$id] != null;
			} 
			
			function signUp(event) {
				EventService.signUp(event, getMemberJson($scope.member));
			}

			function dropOut(event) {	
				EventService.dropOut(event, getMemberJson($scope.member));
			}
			
			function playerCount(event) {
				var count = 0;
				if(event != null && event.members != null) {
					angular.forEach(event.members, function(member) {
						count += 1;
					});
				}	
				return count;
			}
			
			function getMemberJson(member) {
				var json = {
					firstName: member.firstName,
					lastName: member.lastName,
					uid: member.$id
				}
				return json;
			}
    	}
})();
