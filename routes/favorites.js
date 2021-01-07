const favctllr = require("../lib/favorites_controller"),
      middleware = require("../middleware/particular_middleware");


module.exports = function (app) {
    
    app.post("/favorites", middleware.chkParamsFavorites, favctllr.setFavorite);
    app.get("/favorites", favctllr.queryFavorites);
    //unsetFavorite shares parameters filter of deleteItem
    app.delete("/favorites", middleware.chkParamsFavorites, favctllr.unsetFavorite);

}