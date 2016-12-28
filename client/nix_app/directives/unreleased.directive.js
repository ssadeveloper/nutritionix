(function () {
  'use strict';

  angular.module('nutritionix')
    .directive('unreleased', function ($location) {
      return function (scope, element, attributes) {
        element.hide();
        scope.$watch(() => $location.search().developer, function (enabled) {
          element.toggle(!!enabled);
        })
      };
    });
}());
