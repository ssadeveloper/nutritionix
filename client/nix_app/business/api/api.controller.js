(function () {
  'use strict';

  angular
    .module('businessApi')
    .controller('businessApiCtrl', businessApiCtrl);

  function businessApiCtrl($anchorScroll, $window) {

    //
    // VARIABLES
    //
    var vm = this;

    vm.jumpToContact = function () {
      $anchorScroll('contactForm');
      $window.document.getElementById('messageBody').focus();
    }
  }
})();
