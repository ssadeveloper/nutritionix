(function () {
  'use strict';

  angular
    .module('items')
    .controller('itemsDetailCtrl', itemsDetailCtrl);

  function itemsDetailCtrl(item, tagData, ServicesFactory, $modal, $state, $filter) {
    var vm = this, params;

    if (!item) {
      $state.go('site.404');
      return;
    }

    params = {
          brand: $filter('cleanurl')(item.brand_name),
          item_name: $filter('cleanurl')(item.item_name),
          item_id: item.item_id
        };

    if (!item.updated_at) {
      item.updated_at = item.created_at;
    }

    vm.item = item;
    vm.tagData = tagData && angular.copy(tagData.data);

    if (item.recipe) {
      var recipeFactor = vm.item.metric_qty / vm.item.recipe.total_weight;
      _.forEach(item.recipe.ingredients, function (ingredient) {
        ingredient.serving_qty *= recipeFactor;
        ingredient.serving_weight *= recipeFactor;
        ingredient.calories *= recipeFactor;
      });
    }

    $state.go('site.itemsDetail', params, {notify:false, reload:false});

    vm.chart = {
      nutrient: 'calories',
      getAttribute: function () {
        return 'ratio_' + this.nutrient;
      },
      nutrients: (function () {
        var nutrients = {
          protein:  'Protein',
          calories: 'Calories',
          carb:     'Carbohydrate',
          sodium:   'Sodium',
          fat:      'Fat',
          sugars:   'Sugars'
        };

        if (tagData && tagData.data && tagData.data.items) {
          return _.pick(nutrients, function (name, nutrient) {
            var items = _.filter(tagData.data.items, function (item) {
              return (parseFloat(item['ratio_' + nutrient]) || 0) > 0;
            });

            return items.length >= tagData.data.items.length / 2;
          });
        }

        return nutrients;
      }()),
      reset: function () {
        var attribute = this.getAttribute();

        vm.tagData = angular.copy(tagData.data);

        if (!_.find(tagData.data.items, {
            item_id: item.item_id
          })) {
          tagData.data.items.push(item);
        }

        vm.tagData.items = _.map(tagData.data.items, function (item) {
          if (!item[attribute]) {
            item[attribute] = 0;
          }

          return item;
        }).sort(function (a, b) {
          if (parseFloat(a[attribute]) < parseFloat(b[attribute]) ||
            a[attribute].toString() === b[attribute].toString() && b.item_id === vm.item.item_id) {
            return -1;
          }
          if (parseFloat(a[attribute]) > parseFloat(b[attribute]) ||
            a[attribute].toString() === b[attribute].toString() && a.item_id === vm.item.item_id) {
            return 1;
          }

          return 0;
        });

        this.populateChartData();
      },
      populateChartData: function () {
        var attribute = this.getAttribute();
        if (vm.tagData && vm.tagData.items) {
          this.data = [
            [],
            []
          ];

          _.forEach(vm.tagData.items, function (tagItem) {
            var value = tagItem[attribute];
            if (tagItem.item_id === item.item_id) {
              vm.chart.data[0].push(value);
              vm.chart.data[1].push(0);
            } else {
              vm.chart.data[1].push(value);
              vm.chart.data[0].push(0);
            }
          });

          this.labels = _.map(this.data[0], function () {
            return '';
          });
        }
      },
      labels: [],
      data: [],
      getLegend: function (prefix, suffix) {
        return (prefix || '') + this.nutrients[this.nutrient] + (suffix || '');
      }
    };

    if (!vm.chart.nutrients[vm.chart.nutrient]) {
      vm.chart.nutrient = _.keys(vm.chart.nutrients)[0];
    }

    if (tagData && vm.item.item_type == 2 && vm.item.metric_qty) {
      vm.chart.reset();

      vm.getX = function () {
        var attribute = vm.chart.getAttribute();
        return _.filter(tagData.data.items, function (item) {
          return item[attribute] > vm.item[attribute];
        }).length / tagData.data.items.length * 100;
      };
    }

    if (tagData) {
      vm.popularInTag = _(tagData.data.items).filter(function (item) {
        return !item.has_default_package_url;
      }).shuffle().slice(0, 3).value();
    }

    vm.logFoodModal = function () {
      $modal.open({
        animation: true,
        templateUrl: ServicesFactory.formatTemplateUrl('/nix_app/items/logFoodModal/logFoodModal.html')
      });
    }
  }
})();
