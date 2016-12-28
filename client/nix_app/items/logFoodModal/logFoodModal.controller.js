(function () {
  'use strict';

  angular
    .module('foodLog')
    .controller('logFoodModalCtrl', logFoodModalCtrl);

  function logFoodModalCtrl(results, $modalInstance, $timeout) {

    //
    // VARIABLES
    //
    var vm = this;

    //
    // FUNCTIONS
    //

    vm.close = function () {
      vm.response = results.data[0];
      $modalInstance.close();
    };

    $timeout(function () {
      vm.close()
    }, 2400);
  }
})();
