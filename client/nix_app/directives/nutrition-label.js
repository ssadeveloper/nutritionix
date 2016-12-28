'use strict';

/**
 * @ngdoc directive
 * @name nutritionix.directive:nutritionLabel
 * @description
 * # nutritionLabel
 */
angular.module('nutritionix')
  .directive('nutritionLabel', function () {
    return {
      restrict: 'A',
      scope:    {
        item: '=nutritionLabel'
      },
      link:     function postLink(scope, element, attributes) {
        scope.$watch('item', function () {
          var label;
          element.html('');
          if (scope.item) {
            label = angular.element('<div>').attr('id', 'label-' + Math.random().toString(36).substring(2));
            label.appendTo(element);

            label.nutritionLabel({
              'width':                           attributes.width || 283,
              'itemName':                        scope.item.item_name,
              'brandName':                       scope.item.brand_name,
              'scrollLongItemNamePixel':         38,
              'decimalPlacesForQuantityTextbox': 2,

              //to show the 'amount per serving' text
              'showAmountPerServing': true,
              //to enable rounding of the numerical values based on the FDA rounding rules
              //http://goo.gl/RMD2O
              'allowFDARounding':     true,

              //to show the ingredients value or not
              'showIngredients': false,

              //to show the 'servings per container' data and replace the default 'Serving Size' value (without unit and servings per container text and value)
              showServingsPerContainer: false,

              //these values can be change to hide some nutrition values
              showServingUnitQuantity:        angular.isUndefined(scope.item.showServingUnitQuantity) && true ||
                                              scope.item.showServingUnitQuantity,
              showServingUnitQuantityTextbox: angular.isUndefined(scope.item.showServingUnitQuantityTextbox) && true ||
                                              scope.item.showServingUnitQuantityTextbox,
              showItemName:                   angular.isUndefined(scope.item.showItemName) && true ||
                                              scope.item.showItemName,

              showCalories:      scope.item.calories !== null,
              'showFatCalories': scope.item.calories !== null,
              'showTotalFat':    scope.item.total_fat !== null,
              'showSatFat':      scope.item.saturated_fat !== null,
              'showTransFat':    scope.item.trans_fat !== null,
              'showPolyFat':     false,
              'showMonoFat':     false,
              'showCholesterol': scope.item.cholesterol !== null,
              'showSodium':      scope.item.sodium !== null,
              'showTotalCarb':   scope.item.total_carb !== null,
              'showFibers':      scope.item.dietary_fiber !== null,
              'showSugars':      scope.item.sugars !== null,
              'showProteins':    scope.item.protein !== null,
              'showVitaminA':    scope.item.vitamin_a !== null,
              'showVitaminC':    scope.item.vitamin_c !== null,
              'showCalcium':     scope.item.calcium_dv !== null,
              'showIron':        scope.item.iron_dv !== null,

              //'valueServingPerContainer': 1, //?
              'valueServingUnitQuantity': scope.item.serving_qty,
              'valueServingSizeUnit':     scope.item.serving_unit,
              'valueServingWeightGrams':  scope.item.metric_qty,

              'valueCalories':    scope.item.calories,
              'valueFatCalories': scope.item.total_fat * 9,
              'valueTotalFat':    scope.item.total_fat,
              'valueSatFat':      scope.item.saturated_fat,
              'valueTransFat':    scope.item.trans_fat,
              //'valuePolyFat':             scope.item.?,
              //'valueMonoFat':             scope.item.?,
              'valueCholesterol': scope.item.cholesterol,
              'valueSodium':      scope.item.sodium,
              'valueTotalCarb':   scope.item.total_carb,
              'valueFibers':      scope.item.dietary_fiber,
              'valueSugars':      scope.item.sugars,
              'valueProteins':    scope.item.protein,
              'valueVitaminA':    scope.item.vitamin_a,
              'valueVitaminC':    scope.item.vitamin_c,
              'valueCalcium':     scope.item.calcium_dv,
              'valueIron':        scope.item.iron_dv
            });
          }
        });

      }
    };
  });
