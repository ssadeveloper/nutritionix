(function () {
  'use strict';

  angular
    .module('account')
    .controller('LoginCtrl', LoginCtrl);


  function LoginCtrl($scope, $state, Facebook, $q, user, nixTrackApiClient) {
    var vm = $scope.vm = this;

    vm.credentials = {
      email:    '',
      password: ''
    };

    vm.loginWithFacebook = function () {
      vm.loginWithFacebook.$error = null;

      $q(function (resolve, reject) {
        Facebook.getLoginStatus(function (response) {
          if (response.status === 'connected') {
            resolve(response);
          } else {
            Facebook.login(function (response) {
              if (response.status === 'connected') {
                resolve(response);
              } else {
                reject(response);
              }
            });
          }
        });
      }).then(function (response) {
        return nixTrackApiClient.oauth.facebook
          .i(response.authResponse.accessToken)
          .success(function (data) {
            if (data.link_hash) {
              $state.go('account.auth.create.step2', {
                link_hash:  data.link_hash,
                first_name: data.user.first_name || null,
                last_name:  data.user.last_name || null,
                facebook:   true
              });
            } else {
              user.setIdentity(data);
            }
          });
      }).catch(function (response) {
        vm.loginWithFacebook.$error = response;
      });
    };

    vm.signIn = function () {
      vm.signIn.$error = null;

      nixTrackApiClient.auth.signin(vm.credentials)
        .success(function (data) {
          user.setIdentity(data);
        })
        .error(function (response) {
          vm.signIn.$error = response;
        })
    }
  }
})();

