(function () {
  'use strict';

  angular.module('nutritionix')
    .factory('ServicesFactory', ServicesFactory);

  function ServicesFactory($sce, baseUrl) {
    function formatTemplateUrl(templateUrl) {
      if (templateUrl[0] !== '/') {
        templateUrl = '/' + templateUrl;
      }
      return $sce.trustAsResourceUrl(baseUrl + templateUrl);
    }

    function cleanUrl(string) {
      var cleanString = string.trim();
      cleanString = cleanString.replace(/[^\w'+]/g, '-').toLowerCase();
      cleanString = cleanString.replace(/'/g, '');
      return cleanString.replace(/(-)\1{1,}/g, '-');
    }

    function cleanWords(string) {
      return string.replace(/\W/g, ' ');
    }

    function roundingCaloriesFDA(calories) {
      calories = Math.round(calories + 0);
      if (calories < 5) {
        return 0;
      }
      if (calories >= 5 && calories <= 50) {
        return (5 * Math.round(calories / 5));
      } else {
        return (Math.round(calories / 10) * 10);
      }
    }

    return {
      formatTemplateUrl:   formatTemplateUrl,
      cleanUrl:            cleanUrl,
      roundingCaloriesFDA: roundingCaloriesFDA,
      cleanWords:          cleanWords
    };
  }
})();
