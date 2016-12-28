(function () {
  'use strict';

  angular
    .module('nutritionix')
    .filter('cleanurl', function () {
      return function (string) {
        var cleanString = _.trim(string || '');
        cleanString = cleanString.replace(/[^\w'+]/g, '-').toLowerCase();
        cleanString = cleanString.replace(/'/g, '');
        return cleanString.replace(/(-)\1{1,}/g, '-');
      }
    });

}());
