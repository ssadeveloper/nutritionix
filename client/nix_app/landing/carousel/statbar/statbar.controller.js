(function () {
  'use strict';

  angular
    .module('statbar')
    .controller('StatbarCtrl', StatbarCtrl);

  function StatbarCtrl(StatbarFactory, $timeout) {

    //
    // VARIABLES
    //
    var vm = this;
    vm.showAnimation = true;
    vm.screenReader = true;

    StatbarFactory.getStats().then(function (response) {
      vm.cpgCount = response.data.cpg_count;
      vm.restaurantCount = response.data.restaurant_count;
      vm.cpgImagesCount = response.data.cpg_images_count;
      vm.usdaCount = response.data.usda_count;
      vm.updatedAt = response.data.updated_at;
      vm.lastItemAddedAt = response.data.last_item_added;
    });

    $timeout(function () {
      vm.showAnimation = false;
    }, 1000);



  }
})();
