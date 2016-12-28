(function () {
  'use strict';

  angular
    .module('nutritionix')
    .filter('fdaRound', function ($filter) {

      /**
       * Class FDARounder
       * @link http://www.fda.gov/Food/GuidanceRegulation/GuidanceDocumentsRegulatoryInformation/LabelingNutrition/ucm064932.htm
       */
      var FDARounder = {
        round: function (data, attribute) {
          return data[attribute] ? this["round_" + attribute](data[attribute]) : 0;
        },

        roundAs: function (value, attribute) {
          return this["round_" + attribute](value);
        },

        /**
         * @param value
         * @return float
         */
        round_calories: function (value) {
          return $filter('smartNumber')(this.round1(value));
        },

        round_fat_calories: function (value) {
          return this.round1(value);
        },

        /**
         * <table>
         * <thead>
         *  <tr>
         *      <th>Nutrient</th>
         *      <th>Increment Rounding</th>
         *      <th>Insignificant Amount</th>
         *  </tr>
         * </thead>
         * <tbody>
         *  <tr>
         *      <td>
         *          Calories <em>(1)</em><br>
         *          Calories from Fat <em>(1)(ii)</em><br>
         *          Calories from Saturated Fat <em>(1)(iii)</em>
         *      </td>
         *      <td>
         *          &lt; 5 cal - express as 0<br>
         *          ≤50 cal - express to nearest 5 cal increment<br>
         *          &gt; 50 cal - express to nearest 10 cal increment
         *      </td>
         *      <td>&lt; 5 cal</td>
         *  </tr>
         * </tbody>
         *
         * @param value
         * @return float
         */
        round1: function (value) {
          if (value < 5) {
            return 0;
          }

          if (value <= 50) {
            return this.roundToNearestIncrement(value, 5);
          }

          return this.roundToNearestIncrement(value, 10);
        },

        round_total_fat: function (value) {
          return this.round2(value);
        },

        round_saturated_fat: function (value) {
          return this.round2(value);
        },

        round_trans_fat: function (value) {
          return this.round2(value);
        },

        /**
         * <table>
         * <thead>
         *  <tr>
         *      <th>Nutrient</th>
         *      <th>Increment Rounding</th>
         *      <th>Insignificant Amount</th>
         *  </tr>
         * </thead>
         * <tbody>
         *  <tr>
         *      <td>
         *          Total Fat <em>(2)</em><br>
         *          Saturated Fat <em>(2)(i)</em><br>
         *          Trans Fat <em>(2)(ii)</em><br>
         *          Polyunsaturated Fat <em>(2)(iii)</em>
         *          <br>Monounsaturated Fat <em>(2)(iv)</em>
         *      </td>
         *      <td>
         *          &lt; .5 g - express as 0<br>
         *          &lt; 5 g - express to nearest .5g increment<br>
         *          ≥5 g - express to nearest 1 g increment
         *      </td>
         *      <td>&lt; .5 g</td>
         *  </tr>
         * </tbody>
         *
         * @param value
         * @return float
         */
        round2: function (value) {
          if (value < 0.5) {
            return 0;
          }

          if (value < 5) {
            return this.roundToNearestIncrement(value, 0.5);
          }

          return this.roundToNearestIncrement(value, 1);
        },

        /**
         * <table>
         * <thead>
         *  <tr>
         *      <th>Nutrient</th>
         *      <th>Increment Rounding</th>
         *      <th>Insignificant Amount</th>
         *  </tr>
         * </thead>
         * <tbody>
         *  <tr>
         *      <td>
         *          Cholesterol <em>(3)</em>
         *      </td>
         *      <td>
         *          &lt; 2 mg - express as 0<br>
         *          2 - 5 mg - express as "< 5 mg"<br>
         *          &gt; 5 mg - express to nearest 5 mg increment
         *      </td>
         *      <td>&lt; 2 mg</td>
         *  </tr>
         * </tbody>
         *
         * @param value
         * @return float
         */
        round_cholesterol: function (value) {
          if (value < 2) {
            return 0;
          }

          if (value <= 5) {
            return '< 5';
          }

          return this.roundToNearestIncrement(value, 5);
        },

        round_sodium: function (value) {
          return $filter('smartNumber')(this.round3(value));
        },

        /**
         * <table>
         * <thead>
         *  <tr>
         *      <th>Nutrient</th>
         *      <th>Increment Rounding</th>
         *      <th>Insignificant Amount</th>
         *  </tr>
         * </thead>
         * <tbody>
         *  <tr>
         *      <td>
         *          Sodium <em>(4)</em><br>
         *          Potassium <em>(5)</em></td>
         *      </td>
         *      <td>
         *          &lt; 5 mg - express as 0<br>
         *          5 - 140 mg - express to nearest 5 mg increment<br>
         *          &gt; 140 mg - express to nearest 10 mg increment
         *      </td>
         *      <td>&lt; 5 mg</td>
         *  </tr>
         * </tbody>
         *
         * @param value
         * @return float
         */
        round3: function (value) {
          if (value < 5) {
            return 0;
          }

          if (value <= 140) {
            return this.roundToNearestIncrement(value, 5);
          }

          return this.roundToNearestIncrement(value, 10);
        },

        round_total_carb: function (value) {
          return this.round4(value);
        },

        round_fibers: function (value) {
          return this.round4(value);
        },

        round_sugars: function (value) {
          return this.round4(value);
        },

        /**
         * <table>
         * <thead>
         *  <tr>
         *      <th>Nutrient</th>
         *      <th>Increment Rounding</th>
         *      <th>Insignificant Amount</th>
         *  </tr>
         * </thead>
         * <tbody>
         *  <tr>
         *      <td>
         *          Total Carbohydrate <em>(6)</em><br>
         *          Dietary Fiber <em>(6)(i)</em><br>
         *          Sugars <em>(6)(ii)</em>
         *      </td>
         *      </td>
         *      <td>
         *          &lt; .5 g - express as 0<br>
         *          &lt; 1 g - express as "Contains < 1 g" or "< 1 g"<br>
         *          ≥1 g - express to nearest 1 g increment
         *      </td>
         *      <td>&lt; 1 g</td>
         *  </tr>
         * </tbody>
         *
         * @param value
         * @return float
         */
        round4: function (value) {
          if (value < 0.5) {
            return 0;
          }

          if (value < 1) {
            return '< 1';
          }

          return this.roundToNearestIncrement(value, 1);
        },

        /**
         * <table>
         * <thead>
         *  <tr>
         *      <th>Nutrient</th>
         *      <th>Increment Rounding</th>
         *      <th>Insignificant Amount</th>
         *  </tr>
         * </thead>
         * <tbody>
         *  <tr>
         *      <td>
         *          Protein <em>(7)</em>
         *      </td>
         *      </td>
         *      <td>
         *          &lt; .5 g - express as 0<br>
         *          &lt; 1 g - express as "Contains < 1 g" or "< 1 g" or to 1 g if .5 g to &lt; 1 g<br>
         *          ≥1 g - express to nearest 1 g increment
         *      </td>
         *      <td>&lt; 1 g</td>
         *  </tr>
         * </tbody>
         *
         * @param value
         * @return float
         */
        round_protein: function (value) {
          if (value < 0.5) {
            return 0;
          }

          if (value < 1) {
            return '< 1';
          }

          return this.roundToNearestIncrement(value, 1);
        },

        roundToNearestIncrement: function (value, increment) {
          return (increment < 0) ?
          Math.round(value * increment) / increment :
          Math.round(value / increment) * increment;
        }
      };


      return function (value, nutrient) {
        return FDARounder.roundAs(value, nutrient);
      }
    });

}());
