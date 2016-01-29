(function() {
    'use strict';

    angular
    	.module('hb.the441')
    	.controller('HeaderController', HeaderController);
    	
    	HeaderController.$inject = ['$scope', '$log', '$rootScope', 'pageHeader', '$state', '$stateParams', 'AuthService', 'EventService'];
    	
    	function HeaderController ($scope, $log, $rootScope, pageHeader, $state, $stateParams, AuthService, EventService) 
    	{
    		$scope.menustate = false;
    		$scope.header = pageHeader;
    		$scope.logout = logout;
    		$scope.createEvent = createEvent;
    		
    		function logout() {
    			AuthService.logout().then(function(authData){
    				if(!authData) {
    					$state.transitionTo($state.current, $stateParams, {reload: true, inherit: false, notify: true });
    				}
    			});
    		};
    		
    		function createEvent() {
    			$rootScope.$broadcast('newEvent', {});
    		}

    	}
})();
