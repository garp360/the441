(function() {
    'use strict';

    angular
    	.module('hb.the441')
    	.factory('AuthService', AuthService);

    	AuthService.$inject = ['$q', '$log', '$state', '$firebaseAuth', '$firebaseArray', '$firebaseObject', 'ValidationService'];
    
    	function AuthService($q, $log, $state, $firebaseAuth, $firebaseArray, $firebaseObject, ValidationService) 
    	{
			var factory = {};
			var authRef = new Firebase("https://441.firebaseio.com");
			var memberRef = new Firebase("https://441.firebaseio.com/member");
			
			factory.isAuthenticated = isAuthenticated;
			factory.login = login;
			factory.logout = logout;
			factory.register = register;
			
			function isAuthenticated() 
			{
				return $firebaseAuth(authRef).$getAuth();
			}

			function login(credentials) 
			{
				var authObj = $firebaseAuth(authRef);
				var deferred = $q.defer();

				ValidationService.validateLogin(credentials).then(function(json) {
					return authObj.$authWithPassword({ email: json.email, password: json.password });
				}).then(function(authData){
					return memberRef.child(authData.uid);
				}).then(function(member){
					deferred.resolve(member);
				}).catch(function(errMsg){
					deferred.reject(errMsg);
				});
				
				return deferred.promise;
			}
			
			function logout() {
				var deferred = $q.defer();
				
				var authObj = $firebaseAuth(authRef);
				authObj.$unauth();

				deferred.resolve(isAuthenticated())
				
				return deferred.promise;
			}

			function register(registration) 
			{
				var deferred = $q.defer();
				var authObj = $firebaseAuth(authRef);
				var registrationForm = {};
				var member = {};
				
				ValidationService.validateRegistration(registration).then(function(json) {
					registrationForm = json;
					return authObj.$createUser({ email: registrationForm.email, password: registrationForm.password });
				}).then(function(userData){
					return memberRef.child(userData.uid).set(registrationForm);
				}).then(function(memberData){
					member = memberData;
					return authObj.$authWithPassword({ email: registrationForm.email, password: registrationForm.password });
				}).then(function(authData){
					deferred.resolve(member);
				}).catch(function(err){
					var errMsg = err;
				    switch (err.code) {
				      case "EMAIL_TAKEN":
				    	errMsg = "The new user account cannot be created because the email is already in use.";
				        break;
				      case "INVALID_EMAIL":
				    	  errMsg = "The specified email is not a valid email.";
				        break;
				    }
					deferred.reject(errMsg);
				});
				
				return deferred.promise;
			}
			
			
			return factory;
    	};
})();

