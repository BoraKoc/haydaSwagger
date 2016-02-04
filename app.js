'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  // Add swagger-ui (This must be before swaggerExpress.register)

  // Add headers

  //app.use(function (req, res, next) {
  //  // Website you wish to allow to connect
  //  res.setHeader('Access-Control-Allow-Origin', '*');
  //  // Request methods you wish to allow
  //  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //  // Request headers you wish to allow
  //  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token,x-key,Accept');
  //  next();
  //});

  // Auth Middleware - This will check if the token is valid
  //  app.all('/api/*', [require('./api/helpers/validateRequest')]);

  // install middleware
  swaggerExpress.register(app);

  require('./swagger-ui-router.js')(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  console.log('API ready to run..')
});
