(function () {
  "use strict";

  angular.module('account')
    .factory('user', function ($rootScope, $state, $localStorage) {
      return {
        getIdentity: function () {
          return $localStorage.user;
        },
        setIdentity: function (userData) {
          $localStorage.user = userData;
        },
        logout:      function () {
          this.setIdentity(null);
        },
        'get':       function (propertyName) {
          if(propertyName == 'jwt' || propertyName === 'x-user-jwt'){
            return _.get(this.getIdentity(), 'x-user-jwt');
          }

          return _.get(this.getIdentity(), 'user.' + propertyName);
        }
      };
    })
}());
