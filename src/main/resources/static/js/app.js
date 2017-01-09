angular.module('app', [ 'ngRoute' ])
  .config(function($routeProvider, $httpProvider) {

    $routeProvider.when('/', {
      templateUrl : 'templates/home.html',
      controller : 'home'
    }).when('/login', {
      templateUrl : 'templates/login.html',
      controller : 'login'
    }).otherwise('/')
    .when('/home', {
      templateUrl : 'templates/home.html',
      controller : 'home'
    }).otherwise('/');
    
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

  })
  .config(['$locationProvider', function($locationProvider) {
	  $locationProvider.html5Mode(true);
  }])
  .controller('home', function($http, $scope) {
	  $http.get('token').then(function(response) {
	    $http({
	      url : 'http://localhost:9000',
	      method : 'GET',
	      headers : {
	        'X-Auth-Token' : response.data.token
	      }
	    }).then(function(response) {
	    	$scope.greeting = response.data;
	    });
	  });
  })
  .controller('login', ['$scope', '$http', '$location', '$rootScope', function($rootScope, $http, $location, $scope) {

	  $scope.authenticate = function(credentials, callback) {
			var headers = credentials ? {authorization : "Basic "
			    + btoa(credentials.username + ":" + credentials.password)
			} : {};
			
			$http.get('/user', {headers : headers}).then(function(response) {
			  if (response.data.name) {
			    $rootScope.authenticated = true;
			  } else {
			    $rootScope.authenticated = false;
			  }
			  callback && callback();
			}, function() {
			  $rootScope.authenticated = false;
			  callback && callback();
			});

	  };

	  authenticate();
	  $scope.credentials = {};
	  $scope.login = function() {
		  $scope.authenticate($scope.credentials, function() {
	        if ($rootScope.authenticated) {
	          $location.path("/home");
	          $scope.error = false;
	        } else {
	          $location.path("/login");
	          $scope.error = true;
	        }
	      });
	  };
		  
	  $scope.logout = function() {
	  $http.post('logout', {}).finally(function() {
		$rootScope.authenticated = false;
		$location.path("/");
	  });
	  };
			
	$(document).ready(function () {
		$('#logo').addClass('animated fadeInDown');
		$("input:text:visible:first").focus();
	});
	$('#username').focus(function() {
		$('label[for="username"]').addClass('selected');
	});
	$('#username').blur(function() {
		$('label[for="username"]').removeClass('selected');
	});
	$('#password').focus(function() {
		$('label[for="password"]').addClass('selected');
	});
	$('#password').blur(function() {
		$('label[for="password"]').removeClass('selected');
	});
}]);