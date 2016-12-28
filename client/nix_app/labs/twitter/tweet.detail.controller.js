(function () {
  'use strict';

  angular
    .module('labs.twitter')
    .controller('TweetDetailCtrl', TweetDetailCtrl);

  function TweetDetailCtrl($scope, tweet, $filter, nixTrackApiClient) {
    var vm = $scope.vm = this;
    vm.tweet = tweet;

    nixTrackApiClient.natural.nutrients(tweet.tweet)
      .success(function (data) {
        var topMicronutrients = [305, 306, 262];
        var skipMicronutrients = nixTrackApiClient.macronutrients.concat(topMicronutrients);

        if (!data.foods.length) {
          vm.notFound = {
            message: "We couldn't match any of your foods"
          };
          return;
        }

        vm.tweet.foods = data.foods;
        vm.total = {
          item_name:      'Total',
          brand_name:     'Nutritionix',
          full_nutrients: [],
          metric_qty:     0
        };

        _.forEach(vm.tweet.foods, function (food) {
          vm.total.metric_qty += food.serving_weight_grams;
          _.forEach(food.full_nutrients, function (nutrient) {
            var totalNutrient = $filter('nutrient')(vm.total.full_nutrients, nutrient.attr_id);

            if (totalNutrient) {
              totalNutrient.value += nutrient.value;
            } else {
              vm.total.full_nutrients.push(_.clone(nutrient));
            }
          });
        });

        vm.total.serving_qty = 1;
        vm.total.serving_unit = 'Serving';


        vm.total.calories = $filter('nutrient')(vm.total.full_nutrients, nixTrackApiClient.calories_nutrient, 'value');
        vm.total.total_fat = $filter('nutrient')(vm.total.full_nutrients, 204, 'value');
        vm.total.saturated_fat = $filter('nutrient')(vm.total.full_nutrients, 606, 'value');
        vm.total.trans_fat = $filter('nutrient')(vm.total.full_nutrients, 605, 'value');
        vm.total.cholesterol = $filter('nutrient')(vm.total.full_nutrients, 601, 'value');
        vm.total.sodium = $filter('nutrient')(vm.total.full_nutrients, 307, 'value');
        vm.total.total_carb = $filter('nutrient')(vm.total.full_nutrients, 205, 'value');
        vm.total.dietary_fiber = $filter('nutrient')(vm.total.full_nutrients, 291, 'value');
        vm.total.sugars = $filter('nutrient')(vm.total.full_nutrients, 269, 'value');
        vm.total.protein = $filter('nutrient')(vm.total.full_nutrients, 203, 'value');


        vm.total.vitamin_a = $filter('nutrient')(vm.total.full_nutrients, 318, 'value');
        vm.total.vitamin_a = 100 / 5000 * vm.total.vitamin_a;

        vm.total.vitamin_c = $filter('nutrient')(vm.total.full_nutrients, 401, 'value');
        vm.total.vitamin_c = 100 / 60 * vm.total.vitamin_c;

        vm.total.calcium_dv = $filter('nutrient')(vm.total.full_nutrients, 301, 'value');
        vm.total.calcium_dv = 100 / 1000 * vm.total.calcium_dv;

        vm.total.iron_dv = $filter('nutrient')(vm.total.full_nutrients, 303, 'value');
        vm.total.iron_dv = 100 / 18 * vm.total.iron_dv;

        vm.total.micronutrients = [];

        _.forEach(topMicronutrients, function (nutrientId) {
          var nutrient = $filter('nutrient')(vm.total.full_nutrients, nutrientId);
          if (nutrient) {
            vm.total.micronutrients.push(nutrient);
          }
        });

        _.forEach(vm.total.full_nutrients, function (nutrient) {
          if (_.indexOf(skipMicronutrients, nutrient.attr_id) === -1) {
            vm.total.micronutrients.push(nutrient);
          }
        });
      })
      .error(function (error) {
        if (error.message === "We couldn't match any of your foods") {
          vm.notFound = error;
        } else {
          vm.error = error;
        }
      });
  }

})();


