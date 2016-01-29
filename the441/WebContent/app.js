(function() {
	'use strict';
	
	assignServicesToRootScope.$inject = ['$rootScope', 'AuthService'];
	function assignServicesToRootScope($rootScope, AuthService)
	{
		$rootScope.auth = AuthService;
	}
	
	setRouteAuthentication.$inject = ['$rootScope', '$state', 'AuthService'];
	function setRouteAuthentication($rootScope, $state, AuthService)
	{
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
			if (toState.authenticate && !AuthService.isAuthenticated())
			{
				$state.transitionTo("login");
				event.preventDefault(); 
			} else if (AuthService.isAuthenticated() && (toState.name === 'login' || toState.name === 'register' && AuthService.isAuthenticated())) {
				$state.transitionTo('the441');
				event.preventDefault(); 
			}
		});
	}
	
	angular
		.module('hb.the441', ['ui.router', 'ui.bootstrap.datetimepicker', 'ngMessages', 'firebase'])
		.value('title', 'the441')
		.run(assignServicesToRootScope)
		.run(setRouteAuthentication);
	
})();
