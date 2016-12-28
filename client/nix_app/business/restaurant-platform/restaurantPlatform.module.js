(function () {
  'use strict';

  angular
    .module('restaurantPlatform', [])
    .config(config);

  function config($stateProvider, baseUrl) {
    $stateProvider.state('site.restaurantPlatform', {
      url:         '/business/restaurant',
      metaTags:    {
        title:       'Nutritionix - Restaurant Nutrition Solutions',
        description: 'Nutritionix provides a suite of tools to help restaurants organize and publish their nutrition information online.'
      },
      templateUrl: baseUrl + '/nix_app/business/restaurant-platform/restaurantPlatform.html',
      controller:  'restaurantPlatformCtrl as vm',
      onEnter:     function ($anchorScroll) {
        $anchorScroll();
      }
    });
  }
})();
