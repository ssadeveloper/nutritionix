(function () {
  'use strict';

  angular
    .module('items', [])
    .config(config);

  function config($stateProvider, baseUrl) {
    $stateProvider
      .state('site.itemsSearch', {
        url: '/search?q&page',
        metaTags: {
          title: '{{searchQuery && \'Search results for "\' + searchQuery + \'"\' || \'Please enter a search query\'}}',
          description: 'Search results for "{{searchQuery || "not provided search term"}}" page {{page}}'
        },
        templateUrl: baseUrl + '/nix_app/items/items.list.html',
        controller: 'itemsListCtrl as vm',
        resolve: {
          results:     function (ItemFactory, $state, $stateParams, $q) {
            if (!$stateParams.q) {
              return $q.resolve(null);
            }
            return ItemFactory.searchItems($stateParams.q, $stateParams.page)
              .catch(function (response) {
                if (response.status === 400) {
                  $state.go('site.400');
                } else {
                  return null;
                }
              });
          },
          searchQuery: function (search, $stateParams) {
            return search.query || $stateParams.q && $stateParams.q.replace(/\-/g, ' ');
          },
          page: function($stateParams){
            return $stateParams.page || 1;
          }
        },
        onEnter: function ($anchorScroll) {
          $anchorScroll();
        }
      })
      .state('site.itemsDetail', {
        url: '/i/:brand/:item_name/:item_id',
        metaTags: {
          title:       'Calories in {{item.item_name}} from {{item.brand_name}}',
          description: 'Calories and other nutrition information for {{item.item_name}} from {{item.brand_name}}',
          properties:  {
            'og:image':      '{{item.brand_logo}}',
            'twitter:image': '{{item.brand_logo}}',
            'productID' : '{{item.item_id}}'
          }
        },
        templateUrl: baseUrl + '/nix_app/items/items.detail.html',
        controller: 'itemsDetailCtrl as vm',
        resolve: {
          item: function (ItemFactory, $stateParams, $state) {
            if (!$stateParams.item_id) {
              return null;
            }
            return ItemFactory.searchItemById($stateParams.item_id)
              .catch(function () {
                return null;
              });
          },
          tagData: function (item, GroceryFactory) {
            if (!item) {
              return null;
            }
            return GroceryFactory.getTagData(item.tag_id, item.remote_db_id === 3 && item.remote_db_key)
              .catch(function () {
                return null;
              });
          }
        },
        onEnter: function ($anchorScroll) {
          $anchorScroll();
        }
      })
      .state('site.go', {
        url:        '/go/:redirectType/:item_id',
        template:   '<div style="padding-top: 200px; text-align: center;"><i class="fa fa-5x fa-spinner fa-spin"></i></div>',
        controller: function (ItemFactory, $state, $filter) {
          var info;
          switch ($state.params.redirectType) {
          case 'i':
            info = ItemFactory.searchItemById($state.params.item_id);
            break;
          case 'usda':
            info = ItemFactory.getNdbNoInfo($state.params.item_id);
            break;
          default:
            return $state.go('site.landing');
            break;
          }

          info
            .then(function (urlParams) {
              var params = {
                brand:     $filter('cleanurl')(urlParams.brand_name),
                item_name: $filter('cleanurl')(urlParams.item_name),
                item_id:   urlParams.item_id
              };
              $state.go('site.itemsDetail', params);
            })
            .catch(function (response) {
              if (response.status === 404) {
                $state.go('site.404');
              } else {
                $state.go('site.50x');
              }
            });
        }
      });
  }
})();
