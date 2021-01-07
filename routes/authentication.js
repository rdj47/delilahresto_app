const middleware = require("../middleware/particular_middleware"),
      signup = require("../lib/signup_controller"),
      login = require("../lib/login_controller");

module.exports = function (app) {
    app.post("/signup", middleware.chkParamsCreateUser, signup);
    app.post("/login", middleware.chkParamsLogin, login);
}