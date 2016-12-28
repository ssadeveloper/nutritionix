(function () {
  'use strict';

  angular
    .module('nutritionix')
    .factory('StatbarFactory', StatbarFactory);

  function StatbarFactory($http) {
    var factory = {
      getStats: getStats
    };

    function getStats() {
      return $http.get('//d1gvlspmcma3iu.cloudfront.net/item-totals.json')
        .error(function (data, status) {
          console.log('there was an ', status, ' error:', data);
        });
    }

    return factory;

  }
})();
