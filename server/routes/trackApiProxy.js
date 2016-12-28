'use strict';

var request = require('request');

module.exports = function trackApi(req, res, next) {
  var options = {
    url:     'https://trackapi.nutritionix.com' + req.params[0], //URL to hit
    method:  req.method, //Specify the method
    headers: { //We can define headers too
      'Content-Type':    req.headers['content-type'],
      'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a'
    },
    qs:      req.query
  };

  if(req.headers['x-user-jwt']){
    options.headers['x-user-jwt'] = req.headers['x-user-jwt'];
  }

  //options.qs.errorBypass = '4304c235f2ebca17da40';

  if (req.rawBody) {
    options.body = req.rawBody;
  }

  request(options, function (error, response, body) {
    res.setHeader('Content-Type', response.headers['content-type']);
    res.status(response && response.statusCode || 500).send(error || body);
  });
};
