(function () {
  'use strict';

  angular
    .module('account')
    .controller('addFoodModalCtrl', addFoodModalCtrl);

  function addFoodModalCtrl($scope, $modalInstance, $http, parentVm, user, $filter, moment) {
    var vm = $scope.vm = this;

    //
    // FUNCTIONS
    //

    vm.submit = function () {
      vm.notFound = null;
      vm.error = null;

      if (vm.query) {
        $http.post('/track-api/v1/natural/add', {query: vm.query}, {headers: {'x-user-jwt': user.get('jwt')}})
          .success(function (log) {
            parentVm.log.foods = $filter('orderBy')(
              parentVm.log.foods.concat(log.foods),
              food => moment(food.consumed_at).unix(),
              true
            );

            parentVm.processLog();
            parentVm.loadTotals();
            $modalInstance.close();
          })
          .error(function (error) {
            if (error.message === "We couldn't match any of your foods") {
              vm.notFound = error;
            } else {
              vm.error = error;
            }
          });
      }
    };

    vm.close = function () {
      $modalInstance.dismiss();
    };

  }
})();
