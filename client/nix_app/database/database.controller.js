(function () {
  'use strict';

  angular
    .module('database')
    .controller('databaseCtrl', databaseCtrl);

  function databaseCtrl(StatbarFactory) {
    var vm = this;

    StatbarFactory.getStats().then(function (results) {
      vm.results = results;
      vm.total_items = parseInt(vm.results.data.cpg_count) + parseInt(vm.results.data.restaurant_count) + parseInt(vm.results.data.usda_count);
    });
  }
})();
