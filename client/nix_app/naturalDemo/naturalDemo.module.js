(function () {
  'use strict';

  angular
    .module('naturalDemo', [])
    .config(config);

  function config($stateProvider, baseUrl) {
    $stateProvider
      .state('site.naturalDemo', {
        templateUrl: baseUrl + '/nix_app/naturalDemo/naturalDemo.html',
        controller:  'naturalDemoCtrl as vm',
        onEnter:     function ($anchorScroll) {
          $anchorScroll();
        }
      })
      .state('site.naturalDemo.navigate', {
        metaTags: {
          title: 'Nutritionix - Natural Language Endpoint Demo'
        },
        url: '/natural-demo?q'
      });
  }
})();
