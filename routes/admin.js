const middleware = require("../middleware/particular_middleware"),
      orderctllr = require("../lib/order_controller");

module.exports = function (app) {
    app.get("/dashboard", middleware.onlyAdmin, orderctllr.adminQueryOrders);
    app.put("/dashboard", middleware.onlyAdmin, middleware.chkParamsChangeOrderState, orderctllr.changeOrderState);
    app.delete("/dashboard", middleware.onlyAdmin, middleware.chkParamsAdminDeleteOrder, orderctllr.adminDeleteOrder);
    //app.get("/orderDetails", middleware.onlyAdmin, orderctllr.adminQueryOrderDetails);
}