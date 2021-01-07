
const middleware = require("../middleware/particular_middleware"),
      itemctller = require("../lib/item_controller");

module.exports = function (app) {
    app.post("/item", middleware.onlyAdmin, middleware.chkParamsAddItem, itemctller.addItem);
    app.get("/item", middleware.onlyAdmin, middleware.chkParamsQueryItems, itemctller.queryItems);
    app.put("/item", middleware.onlyAdmin, middleware.chkParamsUpdateItem, itemctller.updateItem);
    app.delete("/item", middleware.onlyAdmin, middleware.chkParamsDeleteItem, itemctller.deleteItem);
}