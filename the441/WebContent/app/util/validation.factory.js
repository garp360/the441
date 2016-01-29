(function() {
    'use strict';

    angular
    	.module('hb.the441')
    	.factory('ValidationService', ValidationService);

    	ValidationService.$inject = [ '$q', '$log' ];
    
    	function ValidationService( $q, $log ) 
    	{
			var factory = {};
			
			var RegistrationForm = function() {
				this.errMsg = [];
				this.firstName = null;
				this.lastName = null;
				this.email = null;
				this.password = null;
				
				this.hasErrors = function() {
					return this.errMsg && this.errMsg.length > 0;
				}
				
				this.getErrMsg = function() {
					return this.errMsg[0];
				}
				
				this.toJson = function() {
					return {
						email : this.email,
						password : this.password,
						firstName : this.firstName,
						lastName : this.lastName
					};
				}
			}
			
			RegistrationForm.prototype.setFirstName = function(value) {
				var filter = /^[a-zA-Z ]{2,30}$/;
				if(!value || !filter.test(value)) 
				{
					var msg = !value ? "First Name is required." : "First Name may only contain letters.";
					this.errMsg.push(msg);			
				} 
				else
				{
					this.firstName = value;
				}
				return this;
			};
			
			RegistrationForm.prototype.setLastName = function(value) {
				var filter = /^[a-zA-Z ]{2,30}$/;
				if(!value || !filter.test(value)) 
				{
					var msg = !value ? "Last Name is required." : "Last Name may only contain letters.";
					this.errMsg.push(msg);		
				} 
				else
				{
					this.lastName = value;
				}
				return this;
			};
			
			RegistrationForm.prototype.setEmail = function(value) {
				var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
				if(!value || !filter.test(value)) 
				{
					var msg = !value ? "Email is required." : "Email does not apper to be valid.";
					this.errMsg.push(msg);			
				} 
				else
				{
					this.email = value;
				}
				return this;
			};
			
			RegistrationForm.prototype.setPassword = function(value1, value2) {
				if(!value1 || !value2 || value1 != value2 || !(value1.trim().length > 4 && value1.trim().length < 21)) 
				{
					var msg = !value1 || !value2 ? "Password is required." : value1 != value2 ? "Passwords do not match." : "Passwords must be 5 to 20 characters in length";
					this.errMsg.push(msg);			
				} 
				else
				{
					this.password = value1;
				}
				return this;
			};
			
			factory.validateRegistration = validateRegistration;
			factory.validateLogin = validateLogin;
			
			function validateLogin(credentials) 
			{
				var deferred = $q.defer();
				
				if(credentials && credentials.email && credentials.password) {
					deferred.resolve({email : credentials.email, password : credentials.password});					
				} else {
					deferred.reject("Username/Password are required.");
				}
				
				return deferred.promise;
			}
			
			function validateRegistration(registration) 
			{
				var deferred = $q.defer();
				var registrationForm = new RegistrationForm()
				.setFirstName(registration.firstName)
				.setLastName(registration.lastName)
				.setEmail(registration.email)
				.setPassword(registration.password1, registration.password2)
				
				if(registrationForm.hasErrors())
				{
					var errMsg = registrationForm.getErrMsg();
					if(errMsg.code) {
						errMsg = errMsg.code;
					}
					deferred.reject(registrationForm.getErrMsg());
				}
				else
				{
					deferred.resolve(registrationForm.toJson());
				}
				
				return deferred.promise;
			}
			
			return factory;
    	};
})();

