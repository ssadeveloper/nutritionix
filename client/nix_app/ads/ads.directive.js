(function () {
  'use strict';

  angular
    .module('ads')
    .directive('ads', ads);

  function ads(ServicesFactory) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: ServicesFactory.formatTemplateUrl('/nix_app/ads/ads.html'),
      controller: function () {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    };
  }
}());
