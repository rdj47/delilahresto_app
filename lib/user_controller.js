const helpers = require('./crypt_controller'),
      config = require('../config/config'),
      jwt = require('jsonwebtoken'),
      mysqlConnector = require ('./mysql_connector');

function UsernameException (exc) {
    console.log("##f()## user_controller-> UserException");
    if(exc[1] == 'isNotUsername') {
        this.errorCode = '4001';
        this.type = 'user';
        //this.params = exc;
        this.errorMessage = 'Username '+exc[0][0]+' does not exist.';
    } else if (exc[1] == 'usernameNotAvailable'){
        this.errorCode = '4000';
        this.type = 'user';
        //this.params = exc;
        this.errorMessage = 'Username '+exc[0][0]+' is not available.';
    }
}

function AuthenticationException (exc) {
    console.log("##f()## user_controller-> AuthenticationException");
    if(exc[1] == 'passwordNotMatches') {
        this.errorCode = '1001';
        this.type = 'authentication';
        this.params = exc;
        this.errorMessage = 'Your credentials are not correct.';
    } 
}

function AuthorizationException (exc) {
    console.log("##f()## user_controller-> AuthorizationException");
    if(exc[1] == 'isNotAdmin') {
        this.errorCode = '1002';
        this.type = 'authorization';
        this.params = exc;
        this.errorMessage = 'User has not admin privileges.';
    } 
}      
    
    
    /*this.toObject = function () {
        return {
            errorCode: this.errorCode,
            type: this.type,
            params: this.params,
            errorMessage: this.errorMessage
        } 
    };*/   


class User {
    
    constructor ( username, fullname, email, phone, address, password, role ) {
        this.username=username;
        this.fullname=fullname;
        this.email=email;
        this.phone=phone;
        this.address=address;
        this.password=password;
        this.role=role;
    }

    async isUsername() {
        console.log("##f()## user_controller-> isUser method");
        let promise= await mysqlConnector.select_bbdd('queryUser', [ this.username ]);
        console.log("Promise: ", promise);
        if(promise.length>0) {
            console.log(this.username, "is username.");
            return true;
        } else {
            console.log(this.username, "is not username.");
            return false;
        }        
    }

    async createUser() {
        console.log("##f()## user_controller-> createUser method");
        if (! await this.isUsername()) {
            let encryptedPass = await helpers.encryptPassword(this.password);
            let newUser = await mysqlConnector.insert_bbdd('createUser', [ this.username, this.fullname, this.email, this.phone, this.address, encryptedPass, this.role ]);
            console.log ("Sequelize promise result: ", newUser);
            console.log ("newUser[0]: ", newUser[0]);
            return newUser[0];
        } else {
            throw new UsernameException([ [ this.username ], 'usernameNotAvailable' ]);
        }
    }

    async userLogin() {
        console.log("##f()## user_controller-> userLogin method");
        if(await this.isUsername()) {
            let queriedUser = await mysqlConnector.select_bbdd('queryUser', [ this.username ]);
            console.log("Sequelize promise result: ", queriedUser);
            console.log("queriedUser[0]: ", queriedUser[0]);
            let userEncryptedPassword = queriedUser[0].PASSWORD;
            console.log("User Encrypted Password: ", userEncryptedPassword);
            let checkPassword = await helpers.matchPassword(this.password, userEncryptedPassword);
            //checkPassword.then (result => {
                console.log("bcrypt promise result: ", checkPassword);
                if (checkPassword) {
                    const token = jwt.sign(this.username, config.key);
                    return token;
                } else  {
                    throw new AuthenticationException([ [ this.username], 'passwordNotMatches' ]);
                } 
            /*}).catch (err => {
                console.log("bcrypt promise error: ", err);
                response = {
                    errorCode: '500',
                    message: "There was an error in login."
                }
                res.status(500).send(response); 
                console.log("Unsuccessful login response sent.");
            });*/
        } else {
            throw new UsernameException([ [this.username], 'isNotUsername' ]);
        } 
    }


    async queryUser() {
        console.log("##f()## user_controller-> queryUser method");
        if(await this.isUsername()) {
            let queriedUser = await mysqlConnector.select_bbdd('queryUser', [ this.username ]);
            console.log("Sequelize promise result: ", queriedUser);
            console.log("queriedUser[0]: ", queriedUser[0]);
            
                return {
                        userId: queriedUser[0].USER_ID,
                        username: queriedUser[0].USERNAME,
                        fullname: queriedUser[0].FULLNAME,
                        email: queriedUser[0].EMAIL,
                        phone: queriedUser[0].PHONE,
                        address: queriedUser[0].ADDRESS,
                        role: queriedUser[0].ROLE,
                        createdAt: queriedUser[0].CREATED_AT,
                        updatedAt: queriedUser[0].UPDATED_AT
                };                    
        } else {
            throw new UsernameException([ [this.username], 'isNotUsername' ]);
        }   
    }
}

const profile = async (req, res, next) => {
    console.log("##f()## user_controller -> profile ");
    try {
        let user = new User(req.user); 
        res.status(200).json({
            //resultCode: 2000,
            userData: await user.queryUser(),
            message: 'Profile queried successfully.'

        });    
        console.log("Successful profile response sent.");   
    } catch (err) {
        console.log("user_controller -> profile (error): ", err);
        if (err instanceof UsernameException) {
            res.status(200).json({
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
        console.log("Unsuccessful profile response sent.");
    }
}



module.exports = { profile, User, UsernameException, AuthenticationException, AuthorizationException };