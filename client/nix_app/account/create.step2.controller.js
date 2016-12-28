(function () {
  'use strict';

  angular
    .module('account')
    .controller('AccountCreateStep2Ctrl', AccountCreateStep2Ctrl);


  function AccountCreateStep2Ctrl($scope, $state, nixTrackApiClient, user) {
    var vm = $scope.vm = this;

    vm.facebook = !!$state.params.facebook;

    vm.showLinkHash = !$state.params.key;

    vm.confirm = {
      track:    false
    };

    vm.signup = {
      first_name: $state.params.first_name || '',
      last_name:  $state.params.last_name || '',
      password:   '',
      link_hash:  $state.params.key || '' /*,
      timezone:   moment.tz.guess() || "US/Eastern"*/
    };

    vm.createAccount = function () {
      vm.createAccount.$error = null;

      if (vm.facebook) {
        delete vm.signup.password;
      }

      nixTrackApiClient.auth.signup.step2(vm.signup)
        .success(function (identity) {
          user.setIdentity(identity);
          $state.go('account.auth.create.complete')
        })
        .error(function (response) {
          vm.createAccount.$error = response;
        })
    }
  }
})();

