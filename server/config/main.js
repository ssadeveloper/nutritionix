var config = {

  'ports': {
    'http': process.env.PORT || 8000
  },
  'nutritionix_api': {
    'id': process.env.NUTRITIONIX_API_ID,
    'key': process.env.NUTRITIONIX_API_KEY
  },
  'mysql': {
    'host': process.env.MYSQL_HOST,
    'user': process.env.MYSQL_USER,
    'password': process.env.MYSQL_PASSWORD
  },
  'mandrill': {
    'key': process.env.MANDRILL_KEY
  },
  nix_database: 'nutritionix-web-test'
};

config.env = process.env.NODE_ENV;

module.exports = config;
