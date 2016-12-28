(function () {
  'use strict';

  angular
    .module('navbar')
    .directive('navbar', navbar);

  function navbar(ServicesFactory) {
    return {
      templateUrl: ServicesFactory.formatTemplateUrl('/nix_app/navbar/navbar.html'),
      scope: true,
      controller: 'NavbarCtrl as vm'
    };
  }
})();
