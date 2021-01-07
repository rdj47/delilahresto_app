const userctllr = require("../lib/user_controller");


module.exports = function (app) {
    app.get("/profile", userctllr.profile);
}