(function() {
    'use strict';

    angular
    	.module('hb.the441')
    	.controller('RegistrationController', RegistrationController);
    
    	RegistrationController.$inject = [ '$scope', '$log', '$state', 'registration', 'AuthService' ];
    	
    	function RegistrationController ( $scope, $log, $state, registration, AuthService ) {
			
    		$scope.errMsg = null;
    		$scope.registration = registration;
    		
    		$scope.cancel = cancel;
    		$scope.clear = clear;
    		$scope.register = register;
    		
    		
    		function cancel() 
    		{
    			clear();
    			$state.go("login");
    		}

    		function clear() 
    		{
    			$scope.registration = {};
    			$scope.errMsg = null;
    		}

    		function register() 
    		{
    			AuthService.register($scope.registration).then(function() {
    				$state.go("the441");
    			}, function(errMsg){
    				$scope.errMsg = errMsg;
    			});
    		}
    	};	
})();