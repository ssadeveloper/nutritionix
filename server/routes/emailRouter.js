'use strict';

var emailRouter = require('express').Router();
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var config = require('../config');
var mandrill = require('mandrill-api/mandrill');
var knex = require('knex').db;

var mandrill_client = new mandrill.Mandrill(config.mandrill.key);

if (process.env.DISABLE_CONTACT_EMAILS) {
  mandrill_client = {
    messages: {
      send: function (config, success, error) {
        return success('Resolved debug');
        //return error({message: 'Rejected debug'});
      }
    }
  };
}

/*******
 /POST
 *******/
emailRouter.post('/', sendEmail);


/*******
 /FUNCTIONS
 *******/

function sendEmail(req, res) {
  var phone = req.body.phone || 'not given';
  var referrer = req.get('Referrer') || 'could not be determined';
  var message = {
    'html':       req.body.message + '<br> Phone: ' + phone + '</br>' + '<br> Requested From: ' + referrer + '</br>',
    'subject':    req.body.subject || 'Nutritionix Help',
    'from_email': req.body.email,
    'to':         [{
      'email': 'support@nutritionix.zendesk.com',
      'type':  'to'
    }],
    'headers':    {
      'Reply-To': req.body.email
    },
    'auto_html':  true
  };

  if (!process.env.DISABLE_CONTACT_EMAILS) {
    knex(config.nix_database + '.nix_mails')
      .insert({
        name:        req.body.name || req.body.email.split('@')[0].replace(/[._]+/, ' '),
        email:       req.body.email,
        body:        JSON.stringify(message),
        datecreated: knex.raw('NOW()'),
        type:        100,
        ip_address:  req.connection.remoteAddress
      })
      .then(function () {
        console.log('email data backup record created');
      })
      .catch(function (error) {
        console.error('email data backup record not created: ', error);
      });
  }

  mandrill_client.messages.send({
    'message': message,
    'async':   false,
    'ip_pool': 'Main Pool'
  }, function (result) {
    res.status(200).send(result);
  }, function (e) {
    console.error(e);
    res.status(500).send(e.message)
  });
}

module.exports = emailRouter;
