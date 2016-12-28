'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs-extra');
var parser = require('ua-parser-js');


router.use(express.static(path.resolve(__dirname, './../../client')));

//redirects
require('./redirects')(router);

router.all('/track-api*?', require('./trackApiProxy'));

router.use('/nixapi', require('./foodRouter.js'));
router.use('/nixapi/labs', require('./labsRouter.js'));
router.use('/email', require('./emailRouter.js'));

router.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});
router.get('/healthCheck', function (req, res) {
  res.status(200).json({
    message: 'Everything is 200 ok!'
  });
});
router.get(/^.*\.\w{2,4}$/, function(req, res){
  res.status(404).end('Requested file does not exist');
});
router.get('*', index);
router.use(notFound404);

function index(req, res) {
  var index = path.join(__rootdirname, '/client/nix_dist/layout.html');
  var unsupported = path.join(__rootdirname, '/client/nix_app/unsupported.html');

  var browser = parser(req.headers['user-agent']).browser;

  if(browser.name === 'IE' && browser.major < 9){
    res.sendFile(unsupported);
    return;
  }

  (function send() {
    fs.stat(index, function (error, stats) {
      if (error) {
        console.log('Waiting for index file');
        setTimeout(send, 500);
      } else {
        res.sendFile(index);
      }
    });
  }());
}

function notFound404(req, res) {
  res.status(404);
  res.sendFile(path.join(__rootdirname, '/client/nix_app/404.html'));
}

module.exports = router;
