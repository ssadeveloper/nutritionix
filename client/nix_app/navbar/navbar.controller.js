(function () {
  'use strict';

  angular
    .module('navbar')
    .controller('NavbarCtrl', NavbarCtrl)
    .directive('focusMe', focusMe);

  function NavbarCtrl($rootScope, search, $state) {

    //
    // VARIABLES
    //

    var vm = this;


    vm.navBarCollapsed = true;
    vm.searchBarCollapsed = $state.current.name !== "site.itemsSearch" || !$state.params.q;

    vm.search = search;

    //
    // FUNCTIONS
    //

    vm.toggleSearchBar = function () {
      vm.navBarCollapsed = true;
      vm.searchBarCollapsed = !vm.searchBarCollapsed;
    };

    vm.toggleNavBar = function () {
      vm.searchBarCollapsed = true;
      vm.navBarCollapsed = !vm.navBarCollapsed;
    };

    //
    // LISTENERS
    //

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
      vm.navBarCollapsed = true;
      vm.searchBarCollapsed = toState.name !== "site.itemsSearch" || !toParams.q;
    })
  }

  //creates a focusMe directive.
  // this is a hack.Should probably find a more elegant way to put focus on without timeout.
  function focusMe($timeout, $parse) {
    return {
      link: function (scope, element, attrs) {
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function (value) {
          if (value === true) {
            return $timeout(function () {
              element[0].focus();
              element[0].setSelectionRange(0, 9999);
              element[0].focus();
            }, 1);
          }
        });
      }
    };
  }

})();
