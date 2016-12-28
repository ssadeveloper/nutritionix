'use strict';

var router = require('express').Router();
var db = require('knex').db;

router.get('/twitter-analyzer', function (req, res, next) {
  db.select([db.raw('CAST(`timestamp` as CHAR) as time'), db.raw('CAST(tweet_id as CHAR) as tweet_id'), 'text as tweet', 'parsed_result as foods', 'twitter_handle as user'])
    .from('hive2.nlp_tweets')
    .orderBy('timestamp', 'desc')
    .limit(20)
    .then(function (rows) {
      rows.forEach(function (tweet) {
        try {
          tweet.foods = JSON.parse(tweet.foods);
        } catch (e) {
          tweet.foods = [];
        }
      });
      res.json(rows)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('failed to query latest tweets');
    })
});

router.get('/twitter-analyzer/:id', function (req, res, next) {
  db.select([db.raw('CAST(`timestamp` as CHAR) as time'), db.raw('CAST(tweet_id as CHAR) as tweet_id'), 'text as tweet', 'parsed_result as foods', 'twitter_handle as user'])
    .from('hive2.nlp_tweets')
    .where('tweet_id', '=', req.params.id)
    .then(function (rows) {
      var tweet = rows[0];
      if (!tweet) {
        res.status(404).send('tweet not found');
        return;
      }

      try {
        tweet.foods = JSON.parse(tweet.foods);
      } catch (e) {
        tweet.foods = [];
      }
      res.json(tweet);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('failed to query latest tweets');
    })
});

module.exports = router;
