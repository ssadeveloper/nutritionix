'use strict';

var knex = require('knex').db;
var querystring = require('querystring');
var _ = require('lodash');

var cleanurl = function (string) {
  var cleanString = _.trim(string || '');
  cleanString = cleanString.replace(/[^\w'+]/g, '-').toLowerCase();
  cleanString = cleanString.replace(/'/g, '');
  return cleanString.replace(/(-)\1{1,}/g, '-');
};

module.exports = function(router){
  // remove trailing slashes from url
  router.use(function (req, res, next) {
    if (req.method === 'GET' && req.path.length > 1 && req.path[req.path.length - 1] === '/') {
      res.redirect(
        301,
        req.originalUrl
          .replace('/?', '?')
          .replace(/\/$/, '')
      );
    } else {
      next();
    }
  });

  router.get('/search/item/:id', function (req, res) {
    res.redirect(301, '/go/i/' + req.params.id);
  });

  router.get('/brand/:brand_slug/products/:brand_id/:page', function (req, res) {
    var url = ['brand', req.params.brand_slug, 'products', req.params.brand_id].join('/');
    var query = req.query;
    query.page = req.params.page;
    res.redirect(301, '/' + url + '?' + querystring.stringify(query));
  });

  router.get('/brands/:type/:page', function (req, res) {
    var url = ['brands', req.params.type].join('/');
    var query = req.query;
    query.page = req.params.page;
    res.redirect(301, '/' + url + '?' + querystring.stringify(query));
  });

  router.get('/nix_labs/twitterLog', function (req, res) {
    res.redirect(301, '/labs/twitter-analyzer');
  });
  router.get('/search/:q', function (req, res) {
    var url = '/search?q=' + req.params.q;
    if (req.query.page) {
      url += '&page=' + req.query.page;
    }
    res.redirect(301, url);
  });
  router.get(/search\/$/, function (req, res) {
    var query = querystring.stringify(req.query);
    if (query) {
      query = '?' + query;
    }
    res.redirect(301, '/search' + query);
  });
  router.get('/search', function (req, res, next) {
    if (!req.query.q) {
      res.status(404);
    } else if (req.query.p) {
      req.query.page = req.query.p;
      delete req.query.p;
      res.redirect(301, '/search?' + querystring.stringify(req.query));
      return;
    }

    next()
  });
  router.get(/^\/i\/\/\/$/i, function (req, res) {
    res.redirect(301, '/');
  });
  router.get('/go/:redirectType/:item_id', function (req, res, next) {
    var info;

    switch (req.params.redirectType) {
    case 'i':
      info = knex.raw('call item_lookup(?)', [req.params.item_id])
        .then(function (response) {
          return response[0][0][0];
        });
      break;
    case 'usda':
      info = knex
        .select(['i._id as item_id', 'i.item_name', 'b.name as brand_name'])
        .from('nutritionix-api.v1_items as i')
        .join('nutritionix-api.v1_brands as b', 'i.brand_id', '=', 'b._id')
        .where({
          'item_type':     3,
          'i.deleted':     0,
          'remote_db_key': req.params.item_id
        })
        .whereRaw('i.`seq` IS NOT NULL')
        .orderBy('seq', 'ASC')
        .limit(1)
        .then(function (rows) {
          return rows[0];
        });
      break;
    default:
      return next();
      break;
    }

    info
      .then(function (urlParams) {
        var url;

        if (!urlParams) {
          res.status(404);
          return next();
        }

        // /i/:brand/:item_name/:item_id
        url = [
          '/i',
          cleanurl(urlParams.brand_name),
          cleanurl(urlParams.item_name),
          urlParams.item_id
        ].join('/');

        res.redirect(301, url);
      })
      .catch(next);
  });

  router.get('/i/:brand/:item_name/:item_id', function (req, res, next) {
    knex.raw('call item_lookup(?)', [req.params.item_id])
      .then(function (response) {
        return response[0][0][0];
      })
      .then(function (item) {
        var url;

        if (!item) {
          res.status(404);
          return next();
        }

        // /i/:brand/:item_name/:item_id
        url = [
          '/i',
          cleanurl(item.brand_name),
          cleanurl(item.item_name),
          item.item_id
        ].join('/');

        if (url === req.originalUrl) {
          return next();
        }

        res.redirect(301, url);
      })
      .catch(next);
  });

  router.get('/brand/:brand_name/products/:id', function (req, res, next) {
    var query = querystring.stringify(req.query);
    if(query){
      query = '?' + query;
    }

    knex.select('*')
      .from('nutritionix-api.v1_brands')
      .where('_id', '=', req.params.id)
      .then(function (rows) {
        return rows[0];
      })
      .then(function (brand) {
        var url;

        if (!brand) {
          res.status(404);
          return next();
        }

        // /brand/:brand_name/products/:id
        url = [
          '/brand',
          cleanurl(brand.name),
          'products',
          brand._id
        ].join('/') + query;

        if (url === req.originalUrl) {
          return next();
        }

        res.redirect(301, url);
      })
      .catch(next);
  });
};
