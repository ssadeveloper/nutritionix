(function () {
  'use strict';

  angular
    .module('recipes', [])
    .config(config);

  function config($stateProvider, baseUrl) {
    $stateProvider.state('site.recipes', {
      abstract: true,
      url:      '/recipes',
      template: '<div ui-view></div>',
      data:     {requiresLogin: true},
      onEnter:  function (forceHttps) {
        forceHttps();
      }
    });

    $stateProvider.state('site.recipes.list', {
      url:         '',
      templateUrl: baseUrl + '/nix_app/recipes/recipes.html',
      onEnter:     function ($anchorScroll) {
        $anchorScroll();
      }
    });

    $stateProvider.state('site.recipes.create', {
      url:         '/new',
      templateUrl: baseUrl + '/nix_app/recipes/create.html',
      onEnter:     function ($anchorScroll) {
        $anchorScroll();
      }
    });
  }
})();
