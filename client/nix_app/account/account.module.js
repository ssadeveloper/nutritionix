(function () {
  'use strict';

  angular
    .module('account', ['facebook'])
    .config(config)
    .run(run)
    .factory('forceHttps', function ($location, $window, $log, $timeout) {
      return function forceHttps() {
        if ($location.protocol() !== 'https') {
          if ($location.host().match('nutritionix.com')) {
            $timeout(()=> $window.location = $location.absUrl().replace('http', 'https'));
            return false;
          } else {
            $log.debug('https will be forced on production site');
          }
        }

        return true;
      };
    });

  function config($stateProvider, baseUrl, FacebookProvider) {
    FacebookProvider.init('484200498422486');
    FacebookProvider.setSdkVersion('v2.5');

    $stateProvider
      .state('account', {
        abstract:    true,
        url:         '/account',
        templateUrl: baseUrl + '/nix_app/layouts/account.html',
        onEnter:     function ($anchorScroll, forceHttps) {
          forceHttps();
          $anchorScroll();
        }
      })
      .state('account.cabinet', {
        abstract:    true,
        templateUrl: baseUrl + '/nix_app/layouts/account.cabinet.html'
      })
      .state('account.cabinet.dashboard', {
        url:         '/dashboard',
        metaTags: {
          title: 'Track - {{ firstname }}\'s Food Log'
        },
        controller:  'AccountDashboardCtrl',
        templateUrl: baseUrl + '/nix_app/account/dashboard.html',
        data:        {requiresLogin: true},
        resolve: {
          firstname: function(user) {
            return user.get('first_name');
          }
        }
      })
      .state('account.auth', {
        abstract:    true,
        templateUrl: baseUrl + '/nix_app/layouts/account.auth.html'
      })
      .state('account.auth.create', {
        abstract:   true,
        url:        '/create',
        template:   '<div ui-view></div>',
        controller: 'AccountCreateCtrl'
      })
      .state('account.auth.create.step1', {
        url:         '/step1',
        controller:  'AccountCreateStep1Ctrl',
        templateUrl: baseUrl + '/nix_app/account/create.step1.html'
      })
      .state('account.auth.create.activate', {
        url:         '/activate?email',
        controller:  'AccountCreateActivateCtrl',
        templateUrl: baseUrl + '/nix_app/account/create.activate.html'
      })
      .state('account.auth.create.step2', {
        url:         '/step2?key&first_name&last_name&facebook',
        controller:  'AccountCreateStep2Ctrl',
        templateUrl: baseUrl + '/nix_app/account/create.step2.html'
      })
      .state('account.auth.create.complete', {
        url:         '/complete',
        templateUrl: baseUrl + '/nix_app/account/create.complete.html'
      })
      .state('account.auth.login', {
        url:         '/login',
        templateUrl: baseUrl + '/nix_app/account/login.html',
        controller:  'LoginCtrl as vm'
      });
  }

  function run($rootScope, $state, user, forceHttps) {
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams /*, fromState, fromParams*/) {
        if (!user.getIdentity()) {
          if (toState.data && toState.data.requiresLogin) {
            event.preventDefault();

            if(forceHttps()){
              user.return = {
                toState:  toState,
                toParams: toParams
              };

              $state.go('account.auth.login');
            }
          }
        } else if (toState.name === 'account.auth.login') {
          event.preventDefault();
          if (user.return) {
            $state.go(user.return.toState, user.return.toParams);
            user.return = null;
          } else {
            $state.go('account.cabinet.dashboard')
          }
        }
      });

    $rootScope.$watch(() => user.getIdentity(),
      function (identity) {
        if (!identity) {
          if ($state.current.data && $state.current.data.requiresLogin) {
            user.return = {
              toState:  $state.current,
              toParams: $state.params
            };
            $state.go('account.auth.login');
          }
        } else if ($state.current.name === 'account.auth.login') {
          if (user.return) {
            $state.go(user.return.toState, user.return.toParams);
            user.return = null;
          } else {
            $state.go('account.cabinet.dashboard')
          }
        }
      });
  }
})();
