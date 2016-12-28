(function () {
  'use strict';

  angular
    .module('account')
    .controller('AccountCreateStep1Ctrl', AccountCreateStep1Ctrl);


  function AccountCreateStep1Ctrl($scope, $state, nixTrackApiClient) {
    var vm = $scope.vm = this;

    vm.createAccount = function () {
      vm.createAccount.$error = null;

      if (!vm.email) {
        return false;
      }

      nixTrackApiClient.auth.signup.step1({email: vm.email})
        .success(function () {
          $state.go('account.auth.create.activate', {email: vm.email})
        })
        .error(function (response) {
          vm.createAccount.$error = response;
        })
    }
  }
})();

