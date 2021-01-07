const helpers = require('./crypt_controller');
const { profile, User, UsernameException }  = require('./user_controller');


//async function signup (req, res) {
const signup = async (req, res, next) => {
    console.log("##f()## signup_controller -> signup ");
    let response;
    try {
        const { username, fullname, email, phone, address, password, role } = req.body.newUserData;
        let newUser = new User(username, fullname, email, phone, address, password, role);
        res.status(200).json({
            //resultCode: 2000,
            userId: await newUser.createUser(),
            message: 'User created successfully.'

        });    
        console.log("Successful sing up response sent.");   

    } catch (err) {
        console.log("signup_controller -> signup (error): ", err);
        if (err instanceof UsernameException) {
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

module.exports = signup;