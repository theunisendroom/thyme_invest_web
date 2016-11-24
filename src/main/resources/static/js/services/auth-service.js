angular.module('app.services', [])

.factory('AuthService', ['$http', function($http) {
  return {
    login: function(credentials) {
      return $http.post('http://localhost:9000/api/login', credentials);
    },
    logout: function() {
      return $http.get('/api/logout');
    }
  };
}]);