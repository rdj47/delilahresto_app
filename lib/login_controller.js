const { query } = require('express'),
      config = require('../config/config'),
      jwt = require('jsonwebtoken'),
      bodyParser = require('body-parser'), 
      crypto = require('./crypt_controller'),
      { profile, User, UsernameException, AuthenticationException }  = require('./user_controller');

const login =  async (req, res, next) => {
    console.log("##f()## login_controller -> login ");
    try { 
        const { username, password } = req.body;
        let user = new User(username, null, null, null, null, password);
        res.status(200).json({
            //resultCode: '2000',
            message: "Successful login.",
            token:  await user.userLogin()
        });
       
    } catch (err) {
        console.log("signup_controller -> signup (error): ", err);
        if (err instanceof UsernameException || err instanceof AuthenticationException) {
            res.status(400).json({
                errorCode: err.errorCode,
                type: err.type,
                params: err.params,
                errorMessage: err.errorMessage,
            });
        } else {
            res.status(500).json({
                errorCode: 9999,
                type: 'internal', 
                errorMessage: 'Transaction can not be completed due to internal error.'
            });
        }
        console.log("Unsuccessful sign up response sent.");
    }
}
module.exports = login;