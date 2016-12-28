(function () {
  'use strict';

  angular
    .module('labs.twitter', ['doowb.angular-pusher', 'ngAnimate', 'ngtweet', 'truncate'])
    .config(config);

  function config($stateProvider, baseUrl, PusherServiceProvider) {
    PusherServiceProvider
      .setToken('ceb8d6b021d46067879c')
      .setOptions({});

    $stateProvider
      .state('site.labs.twitter-analyzer', {
        abstract: true,
        url:      '/twitter-analyzer',
        template: '<div ui-view></div>'
      })
      .state('site.labs.twitter-analyzer.tweets', {
        url:         '',
        metaTags:    {
          title: 'Real-Time Twitter Diet Analyzer powered by Nutritionix'
        },
        templateUrl: baseUrl + '/nix_app/labs/twitter/twitter-analyzer.html',
        controller:  'TwitterAnalyzerCtrl',
        resolve:     {
          initialTweets: function ($http) {
            return $http.get('/nixapi/labs/twitter-analyzer')
              .then(function (response) {
                return response.data || [];
              })
          }
        }
      })
      .state('site.labs.twitter-analyzer.view', {
        url:         '/view/:id',
        metaTags:    {
          title:       '"{{tweet.tweet | characters: 50}}" by @{{tweet.user}} nutrition analysis',
          description: 'A nutrition analysis of the following tweet by @{{tweet.user}}: "{{tweet.tweet}}"'
        },
        templateUrl: baseUrl + '/nix_app/labs/twitter/tweet.detail.html',
        controller:  'TweetDetailCtrl',
        resolve:     {
          tweet: function ($http, $stateParams) {
            return $http.get('/nixapi/labs/twitter-analyzer/' + $stateParams.id, {handle404: true})
              .then(function (response) {
                return response.data;
              });
          }
        }
      });

    moment.locale('en', {
      relativeTime: {
        future: 'in %s',
        past:   '%s ago',
        s:      '%d seconds',
        m:      'a minute',
        mm:     '%d minutes',
        h:      'an hour',
        hh:     '%d hours',
        d:      'a day',
        dd:     '%d days',
        M:      'a month',
        MM:     '%d months',
        y:      'a year',
        yy:     '%d years'
      }
    });
  }
})();
