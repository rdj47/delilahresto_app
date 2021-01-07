const middleware = require("../middleware/particular_middleware"),
      orderctller = require("../lib/order_controller");

module.exports = function (app) {
    app.post("/order", middleware.chkParamsCreateOrder, orderctller.createOrder);
    app.get("/order", middleware.chkParamsQueryUserOrders, orderctller.queryUserOrders);
}