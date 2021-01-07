const bodyParser = require ('body-parser'),
      cors = require('cors'),
      config = require('../config/config'),
      expressJWT = require('express-jwt');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());
    //app.use(expressJWT({ secret: config.key, algorithms: ['HS256'], requestProperty: 'payload' }).unless({ path: ["/login"] })); NOK
    app.use(expressJWT({ secret: config.key, algorithms: ['HS256'] }).unless({ path: ["/login" , "/signup" ] }));
}