(function () {
  'use strict';

  angular
    .module('labs', ['labs.twitter'])
    .config(config);

  function config($stateProvider) {
    $stateProvider.state('site.labs', {
      abstract: true,
      template: '<div ui-view></div>',
      url:      '/labs'
    });
  }
})();
