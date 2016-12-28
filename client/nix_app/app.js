(function () {
  'use strict';

  // needs to be in the separate module to be available in dependencies of the nutritionix module
  angular.module('nutritionix.constants', [])
    .constant('baseUrl', (function () {
      //if (['nutritionixtest.com', 'nutritionix.com'].indexOf(location.host.replace(/^www\./, '')) > -1) {
      //  return '//beta.nutritionix.com';
      //}

      //return '//' + location.host;

      return '';
    }()))
    .constant('cdnUrls', {
      'nix-export': 'https://d1gvlspmcma3iu.cloudfront.net',
      'cdn4-nutritionix': 'https://s3.amazonaws.com/cdn4-nutritionix'
    });

  angular.module('chart.js')
    .directive('chartStackedBar', function (ChartJsFactory) { return new ChartJsFactory('StackedBar'); });

  angular
    .module('nutritionix', [
      'ng.shims.placeholder',
      'debounce',
      'focus-if',
      'angular-google-analytics',
      'angular-snap-engage',
      'angular-prerender',
      'angular-loading-bar',
      'ngMessages',
      'angularMoment',
      'nutritionix.constants',
      'ui.router',
      'ui.bootstrap',
      'ui.router.metatags',
      'rt.encodeuri',
      'nix.track-api-client',
      'navbar',
      'footer',
      'carouselSlide',
      'consumerTools',
      'business',
      'contact',
      'ngSanitize',
      'businessApi',
      'databaseLicense',
      'restaurantPlatform',
      'items',
      'nix.api',
      'ngStorage',
      'about',
      'brands',
      'mini',
      'ads',
      'database',
      'privacy',
      'terms',
      'calculators',
      'grocery',
      'category',
      'account',
      'recipes',
      'naturalDemo',
      'premium',
      'nutritionlink',
      'labs',
      'dailyCalories'
    ])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;
    }])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, baseUrl, $httpProvider) {
      $stateProvider.state('site', {
        abstract:    true,
        templateUrl: baseUrl + '/nix_app/layouts/site.html'
      });

      $stateProvider.state('site.landing', {
        url:         '/',
        metaTags:    {
          description: 'The largest verified database of nutrition information.',
          title:       'Nutritionix - Largest Verified Nutrition Database'
        },
        templateUrl: baseUrl + '/nix_app/landing/landing.html'
      });

      $stateProvider
        .state('site.404', {
          templateUrl: baseUrl + '/nix_app/404.html',
          controller:  function (prerender) {
            prerender.statusCode = 404;
          }
        })
        .state('site.50x', {
          templateUrl: baseUrl + '/nix_app/50x.html',
          controller:  function (prerender) {
            prerender.statusCode = 500;
          }
        })
        .state('site.400', {
          templateUrl: baseUrl + '/nix_app/50x.html',
          controller:  function (prerender) {
            prerender.statusCode = 400;
          }
        });

      $urlRouterProvider.otherwise(function ($injector) {
        $injector.get('$state').go('site.404');
      });

      $locationProvider.html5Mode(true);

      // globally handle internal server errors with 50x error page
      $httpProvider.interceptors.push(function ($q, $injector) {
        return {
          'responseError': function (response) {
            if (response.config.handle404 && response.status === 404) {
              $injector.get('$state').go('site.404');
            }

            if (!response.config.ignore500 && response.status >= 500) {
              $injector.get('$state').go('site.50x');
            }

            return $q.reject(response);
          }
        };
      });
    })
    .config(function (UIRouterMetatagsProvider) {
      var logoUrl = 'https://s3.amazonaws.com/cdn4-nutritionix/images/nutritionix_logo_500px.png';
      let staticProperties = {
        'og:site_name':     'Nutritionix',
        'og:image':         logoUrl,
        'og:type':          'website',
        'og:locale':        'en_US',

        'twitter:card':  'summary',
        'twitter:site':  '@nutritionix',
        'twitter:image': logoUrl
      };

      let appProbability = 4;

      if (Math.floor(Math.random() * (appProbability - 1)) === 0) {
        console.debug(`Showing apple app meta tag with 1/${appProbability} probability`);
        staticProperties['apple-itunes-app'] = 'app-id=1061691342';
      }

      UIRouterMetatagsProvider
        .setDefaultTitle('Nutritionix')
        .setStaticProperties(staticProperties)
        .setOGURL(true);
    })
    .config(function ($logProvider) {
      if (!_(location.host).contains('localhost')) {
        $logProvider.debugEnabled(false);
      }
    })
    .config(function (AnalyticsProvider) {
      // without this it seem to send an extra page view during app initialisation
      AnalyticsProvider.ignoreFirstPageLoad(true);
      AnalyticsProvider.setPageEvent('$delayedStateChangeSuccess');
      AnalyticsProvider.setAccount('UA-19183277-1');
      // Track all URL query params (default is false).
      AnalyticsProvider.trackUrlParams(true);
    })
    .config(function (SnapEngageProvider) {
      SnapEngageProvider.setAccount('547aac0a-80c5-4be2-afe9-c6e15f0f5d59');
    })
    .run(function (Analytics, SnapEngage, $rootScope, baseUrl, $timeout) {
      $rootScope.baseUrl = baseUrl;

      // this way I make analytics be properly affected by UIRouterMetatags service.
      // otherwise GA does not catch up new page title
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $timeout(function () {
          $rootScope.$emit('$delayedStateChangeSuccess', event, toState, toParams, fromState, fromParams);
        }, 0);
      });

      $rootScope.$on('$stateChangeStart', function () {
        SnapEngage.ready.then(function () {
          SnapEngage.service.hideButton();
          SnapEngage.service.allowProactiveChat(false);
        });
      });
    })
    .config(function(nixTrackApiClientProvider){
      nixTrackApiClientProvider.setApiEndpoint('/track-api/v1');
      nixTrackApiClientProvider.setHttpConfig({ignore500: true});
    })
    .run(function(user, nixTrackApiClient){
      nixTrackApiClient.setUserJwt(() => user.get('jwt'));
    });
})();

//bootstrapper fo IE. angularInit's document.querySelector('[ng-app]') does not work in IE 8-9
$(function () {
  var element = $('html');

  if (!element.scope()) {
    angular.bootstrap(element[0], ['nutritionix']);
  }
});
