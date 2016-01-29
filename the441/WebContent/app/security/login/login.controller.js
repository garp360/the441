(function() {
    'use strict';

    angular
    	.module('hb.the441')
    	.controller('LoginController', LoginController);
    
    	LoginController.$inject = ['$scope', '$log', '$state', 'AuthService'];
    	
    	function LoginController ( $scope, $log, $state, AuthService ) 
    	{
			$scope.errMsg = null;
    		$scope.token = {};
    		
    		$scope.login = login;
    		$scope.clear = clear;
    		$scope.register = register;
    		
    		function login() 
    		{
    			AuthService.login($scope.token).then(function() {
    				$state.transitionTo('the441');
    			}, function(errMsg){
    				$scope.errMsg = errMsg;
    			});
    		}
    		
    		function register() 
    		{
    			clear();
				$state.go("register", {'email': $scope.token.email});
			}
			
			function clear() 
			{
				$scope.errMsg = null;
				$scope.token = { };
			}
    	};	
})();