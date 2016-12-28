(function () {
  'use strict';

  angular
    .module('account')
    .controller('AccountDashboardCtrl', AccountDashboardCtrl);

  function AccountDashboardCtrl($scope, user, ServicesFactory, $modal, nixTrackApiClient) {
    var vm = $scope.vm = this;
    vm.user = user;

    vm.targetCalories = 2000;
    vm.calendarLegend = [
      vm.targetCalories * (100 - 15) / 100,
      vm.targetCalories * (100 - 15 / 2) / 100,
      vm.targetCalories,
      vm.targetCalories * (100 + 15 / 2) / 100,
      vm.targetCalories * (100 + 15) / 100
    ];

    vm.addFoodModal = function () {
      $modal.open({
        animation:   true,
        controller:  'addFoodModalCtrl',
        templateUrl: ServicesFactory.formatTemplateUrl('/nix_app/account/modals/addFoodModal.html'),
        resolve:     {
          parentVm: () => vm
        }
      });
    };

    vm.afterLoadDomain = function (date) {
      vm.stats.calculate(date);
    };

    vm.getDatesRange = function () {
      return vm.dates && vm.dates.filter(date => moment().unix() - moment(date).unix() < 7 * 24 * 3600); //last 7 days
    };

    vm.stats = {
      currentMonth:       new Date(),
      calculate:          function (currentMonth) {
        currentMonth = this.currentMonth = currentMonth || this.currentMonth;
        let currentMonthTotals = this.currentMonthTotals = {};

        _.each(vm.calendar, function (value, date) {
          if (moment(date * 1000).format('YYYY-MM') === moment(currentMonth).format('YYYY-MM')) {
            currentMonthTotals[date] = value;
          }
        });


        this.total = _.keys(currentMonthTotals).length;
        this.green = _.filter(currentMonthTotals, value => value <= vm.targetCalories).length;
        this.greenPercentage = this.green / this.total * 100;
      },
      currentMonthTotals: null,
      total:              null,
      green:              null,
      greenPercentage:    null
    };

    vm.stats.greenPercentage = vm.stats.green / vm.stats.total * 100;

    vm.loadLogs = function () {
      nixTrackApiClient.log.get()
        .success(function (log) {
          vm.log = log;
          vm.processLog();
          vm.loadTotals();
        });
    };

    vm.log = {foods: []};

    vm.processLog = function () {
      var entriesByDates = {}, dates = [], totalCalories = {};

      angular.forEach(vm.log.foods, function (entry) {

        if (!entry.consumed_at) {
          entry.consumed_at = entry.created_at;
        }

        var entryDay = moment(entry.consumed_at).format('YYYY-MM-DD');
        if (!entriesByDates[entryDay]) {
          dates.push(entryDay);
          entriesByDates[entryDay] = [];
          totalCalories[entryDay] = 0;
        }

        entriesByDates[entryDay].push(entry);
      });

      dates.forEach(function (date) {
        totalCalories[date] = entriesByDates[date].reduce((total, entry) => total + entry.nf_calories || 0, 0);
      });

      vm.dates = dates;
      vm.totalCalories = totalCalories;
      vm.entriesByDates = entriesByDates;
    };

    vm.loadLogs();

    vm.loadTotals = function () {
      nixTrackApiClient.reports.totals({
        begin:    moment().utc().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
        timezone: moment.tz.guess() || "US/Eastern"
      }).success(function (totals) {
        vm.calendar = {};

        angular.forEach(totals.dates, function (value) {
          vm.calendar[moment(value.date).unix()] = value.total_cal;
        });

        vm.stats.calculate();
      });
    };
  }
})();

