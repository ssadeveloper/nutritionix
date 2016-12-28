global.__rootdirname = require('path').resolve(__dirname, '..');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config');
var knex = require('knex');

knex.db = knex({
  client:     'mysql',
  connection: {
    host:     config.mysql.host,
    user:     config.mysql.user,
    password: config.mysql.password,
    database: 'nutritionix-api',
    timezone: "UTC"
  }
});

var express = require('express');
var app = express();
var morgan = require('morgan');
var router = require('./routes/router.js');
var compression = require('compression');
var bodyParser = require('body-parser');

require('./prerender.js')(app);

app.enable('trust proxy');

app.use(function (req, res, next) {
  var data = '';
  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function () {
    req.rawBody = data;
  });
  next();
});
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('combined'));

// routes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});
app.use(router);

app.listen(config.ports.http, function () {
  console.log('listening on ' + config.ports.http);
});


module.exports = app;
