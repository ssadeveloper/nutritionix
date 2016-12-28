(function () {
  'use strict';

  angular
    .module('dailyCalories')
    .controller('dailyCaloriesCtrl', dailyCaloriesCtrl);

  function dailyCaloriesCtrl($scope, $location, nixTrackCalculator) {
    const vm = this;
    let preset = {
      u: 'i',
      g: 'f',
      w: 63.5,
      h: 166,
      a: 30,
      e: 0
    };

    let search = $location.search();

    if (search.preset) {
      let keyValuePairs = _.filter(search.preset.split(','));
      _.each(keyValuePairs, function (keyValue) {
        let parts = keyValue.split(':');
        if (parts.length === 2) {
          preset[parts[0]] = parts[1] === 'null' ? null : parts[1];
        }
      });
    }


    vm.exerciseLevels = nixTrackCalculator.exerciseLevels;

    vm.unitSystem = preset.u === 'i' ? 'imperial' : 'metric';
    vm.gender = preset.g === 'f' ? 'female' : 'male';
    vm.weight = {
      kg: preset.w,
      lb: null
    };
    vm.height = {
      cm:   preset.h,
      ft:   null,
      inch: null
    };
    vm.age = preset.a;
    vm.exerciseLevel = parseInt(preset.e || 0);

    vm.getRecommendedCalories = function () {
      if (vm.gender && vm.weight.kg > 0 && vm.height.cm > 0 && vm.age > 0) {
        return nixTrackCalculator.calculateRecommendedCalories(vm.gender, vm.weight.kg, vm.height.cm, vm.age, vm.exerciseLevel);
      }
    };

    vm.calculateWeights = function (unitSystem) {
      if ((unitSystem || vm.unitSystem) === 'metric') {
        vm.weight.lb = _.round(vm.weight.kg * 2.20462, 1);
      } else {
        vm.weight.kg = _.round(vm.weight.lb * 0.453592, 1);
      }
    };

    vm.calculateHeights = function (unitSystem) {
      if ((unitSystem || vm.unitSystem) === 'metric') {
        vm.height.inch = vm.height.cm * 0.393701;

        if (vm.height.inch > 12) {
          vm.height.ft = _.floor(vm.height.inch / 12);
          vm.height.inch -= vm.height.ft * 12;
        } else {
          vm.height.ft = 0;
        }
      } else {
        vm.height.cm = (vm.height.ft || 0) * 30.48 + (vm.height.inch || 0) * 2.54;
      }

      _.each(vm.height, (value, key) => vm.height[key] = value === null ? null : (_.floor(value) || 0));
    };

    vm.calculateHeights('metric');

    $scope.$watch(() => JSON.stringify(vm), function (value) {
      let preset = {
        u: vm.unitSystem[0],
        g: vm.gender[0],
        w: vm.weight.kg,
        h: vm.height.cm,
        a: vm.age,
        e: vm.exerciseLevel
      };
      $location.search({preset: _.map(preset, (value, key) => key + ':' + value).join(',')});
    });
  }
})();
