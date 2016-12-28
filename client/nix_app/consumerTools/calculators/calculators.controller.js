(function () {
  'use strict';

  angular
    .module('calculators')
    .controller('calculatorsCtrl', calculatorsCtrl);

  function calculatorsCtrl(calculators) {
    var vm = this;


    vm.calculatorArray = calculators.data[0];
    //
    // VARIABLES
    //
  }
})();
