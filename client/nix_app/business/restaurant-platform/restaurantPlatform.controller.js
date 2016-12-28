(function () {
  'use strict';

  angular
    .module('restaurantPlatform')
    .controller('restaurantPlatformCtrl', restaurantPlatformCtrl);

  function restaurantPlatformCtrl($scope, $anchorScroll, RestaurantPlatformFactory, Analytics) {

    //
    // VARIABLES
    //

    var vm = this;
    vm.errorMessage = "";
    vm.message = {};
    vm.successMessage = '';
    vm.errorMessage = '';

    vm.sendMessage = function () {
      Analytics.trackEvent('button', 'click', 'send message');

      if (!$scope.form) { return; }

      if ($scope.form.$valid) {
        vm.closeAlertMessage();
        vm.closeSuccessAlertMessage();

        RestaurantPlatformFactory
          .sendEmail(vm.message)
          .then(function () {
            vm.message = {};
            vm.successMessage = "We'll be in contact shortly!";
            vm.errorMessage = "";

            $scope.form.$setPristine();
          })
          .catch(function (response) {
            vm.errorMessage = angular.isString(response.data) ? response.data : 'Unexpected backend error';
          })
      } else {
        angular.forEach($scope.form, function (property, key) {
          if (key[0] !== '$' && property.$invalid) {
            property.$setDirty();
          }
        });
      }
    };

    vm.closeAlertMessage = function () {
      vm.errorMessage = "";
    };

    vm.closeSuccessAlertMessage = function () {
      vm.successMessage = "";
    };

    vm.jumpToForm = function () {
      $anchorScroll('restaurantPlatform');
      angular.element('#username').focus();
    };
  }
})();
