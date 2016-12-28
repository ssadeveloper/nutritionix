(function () {
  'use strict';

  angular
    .module('terms', ['nutritionix'])
    .config(config);

  function config($stateProvider, baseUrl) {
    $stateProvider.state('site.terms', {
      url:         '/terms',
      metaTags:    {
        title:       'Nutritionix - Terms and Conditions',
        description: 'Nutritionix - Terms and Conditions'
      },
      templateUrl: baseUrl + '/nix_app/terms/terms.html',
      onEnter:     function ($anchorScroll) {
        $anchorScroll();
      }
    });
  }
})();
