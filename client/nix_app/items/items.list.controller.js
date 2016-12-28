(function () {
  'use strict';

  angular
    .module('items')
    .controller('itemsListCtrl', itemsListCtrl);

  function itemsListCtrl(results, $stateParams, $state, search) {
    //
    // VARIABLES
    //
    var vm = this;

    vm.navigationState = {
      name:   'site.itemsSearch',
      params: {
        q: $stateParams.q
      }
    };

    vm.itemsPerPage = 20;
    vm.results = results && results.data;
    vm.currentPage = $stateParams.page;
    vm.search = search;
    vm.originalQuery = $stateParams.q;

    //
    // FUNCTIONS
    //

    vm.pageChanged = function () {
      $state.go('site.itemsSearch', {
        q: $stateParams.q,
        page: vm.currentPage === 1 ? null : vm.currentPage
      });
    };

    vm.getCurrentPage = function () {
      return parseInt($state.params.page || 1);
    };
  }
})();
