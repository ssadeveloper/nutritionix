(function () {
  'use strict';

  angular
    .module('businessApi', [])
    .config(config);

  function config($stateProvider, baseUrl) {
    $stateProvider.state('site.businessApi', {
      url:         '/business/api',
      metaTags:    {
        title:       'Nutritionix - About our API',
        description: 'The Nutritionix API serves over 5M API requests every month to some of the top health and fitness apps.'
      },
      templateUrl: baseUrl + '/nix_app/business/api/api.html',
      controller:  'businessApiCtrl as vm',
      onEnter:     function ($anchorScroll) {
        $anchorScroll();
      }
    });
  }
})();
