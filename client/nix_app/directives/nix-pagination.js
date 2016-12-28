'use strict';

angular.module('ui.bootstrap.pagination')
  .controller('NixPaginationController', function ($rootScope, $scope, $attrs, $parse, $controller, $state) {
    var controller;

    $scope.getPaginationState = function (page) {
      var params;

      if (!$scope.state) {
        return null;
      }

      params = angular.copy($state.params);
      params.page = page > 1 ? page : null;
      angular.extend(params, $scope.state.params || {});

      angular.forEach(params, function (value, key) {
        if (angular.isFunction(value)) {
          params[key] = value(page);
        }
      });

      return $state.href(page === 1 && $scope.state.nameFirstPage || $scope.state.name, params)
        .replace(/\/$/, '')
    };

    controller = $controller('PaginationController', {
      $scope: $scope,
      $attrs: $attrs,
      $parse: $parse
    });


    $scope.$watch('page', function (page) {
      if (!angular.isUndefined(page)) {
        $rootScope.rel = {
          prev: $scope.noPrevious() ? null : $scope.getPaginationState(page - 1),
          next: $scope.noNext() ? null : $scope.getPaginationState(page + 1)
        };
      }
    });

    $scope.$on('$destroy', function () {
      $rootScope.rel = null;
    });

    return controller;
  });


angular.module('ui.bootstrap.pagination')
  .decorator('paginationDirective', ['$delegate', function ($delegate) {
    $delegate[0].controller = 'NixPaginationController';

    $delegate[0].$$isolateBindings['state'] = {
      attrName: 'state',
      mode:     '=',
      optional: true
    };

    return $delegate;
  }]);

angular.module('ui.bootstrap.pagination')
  .directive('paginationInfo', function () {
    return {
      template: '<pre class="text-center">' +
                'Showing ' +
                '{{ 1 + (itemsPerPage * (currentPage - 1))}} - ' +
                '{{itemsPerPage * currentPage < totalItems ? currentPage * itemsPerPage  : totalItems}} ' +
                'of {{totalItems}}' +
                '</pre>',
      restrict: 'AE',
      scope:    {
        totalItems:   '=',
        currentPage:  '=',
        itemsPerPage: '='
      }
    }
  });

angular.module("template/pagination/pagination.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("template/pagination/pagination.html",
    "<ul class=\"pagination\">\n" +
    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a ng-href='{{getPaginationState(1)}}' ng-click=\"selectPage(1, $event)\">{{::getText('first')}}</a></li>\n" +
    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a rel='prev' ng-href='{{getPaginationState(page - 1)}}' ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
    "  <li ng-repeat=\"pageModel in pages track by $index\" ng-class=\"{active: pageModel.active,disabled: ngDisabled&&!pageModel.active}\" class=\"pagination-page\"><a rel='{{page - 1 == pageModel.number && \"prev\" || page + 1 == pageModel.number && \"next\" || null}}' ng-href='{{getPaginationState(pageModel.number)}}' ng-click=\"selectPage(pageModel.number, $event)\">{{pageModel.text}}</a></li>\n" +
    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a rel='next' ng-href='{{getPaginationState(page + 1)}}' ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a ng-href='{{getPaginationState(totalPages)}}' ng-click=\"selectPage(totalPages, $event)\">{{::getText('last')}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);
