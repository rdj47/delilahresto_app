const { profile, User, UsernameException }  = require('./user_controller'),
      { Item, ItemException } = require('./item_controller'),
      favorites = require('../routes/favorites'),
      mysqlConnector = require ('./mysql_connector');


function FavoritesException (exc) {
    console.log("##f()## favorites_controller-> FavoritesException");
    if (exc[1] == 'alreadyFavorite') {
        this.errorCode = '6010';
        this.type = 'favorites';
        this.params = exc;
        this.errorMessage = 'Item was already set as favorite for the user.'
    } else if(exc[1]=='notUserFavorite') {
        this.errorCode = '6011';
        this.type = 'favorites';
        this.params = exc;
        this.errorMessage = 'Item has not been set as favorite for the user.'
    }
}

class Favorites {

    constructor ( username, itemId ) {
        this.username = username;
        this.itemId = itemId;
    }

    async isUserFavorite() {
        console.log("##f()## favorites_controller-> isFavorite method");
        let promise= await mysqlConnector.select_bbdd('querySingleFavorite', [ this.username, this.itemId ]);
        console.log("Sequelize promise result: ", promise);
        if(promise.length > 0) {
            console.log(this.itemId, "is a favorite of ", this.username);
            return true;
        } else {
            console.log(this.itemId, "is not a favorite of ", this.username);
            return false;
        }
    }
    
    async setFavorite() {
        console.log("##f()## favorites_controller-> setFavorite method");
        let user = new User(this.username);
        if(await user.isUsername()){
            let item = new Item(this.itemId);
            if(await item.isItemId()){
                if(! await this.isUserFavorite()) {
                    console.log("Sequelize promise result: ", await mysqlConnector.insert_bbdd('setFavorite', [ this.username, this.itemId ]));
                } else {
                    throw new FavoritesException([ [this.username, this.itemId], 'alreadyFavorite' ]);
                }                 
            } else {
                throw new ItemException([this.itemId, 'isNotItem']);
            }
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }      
    }
    
    async queryFavorites() {
        console.log("##f()## favorites_controller-> queryFavorites method");
        let user = new User(this.username);
        if(await user.isUsername()){
            let favorites = await mysqlConnector.select_bbdd('queryFavorites', [ this.username ]);
            console.log("Sequelize promise result: ", favorites);
            let objectFavorites = [];
            for (let i=0; i<favorites.length; i++) {
                objectFavorites.push({
                    itemId: favorites[i].ITEM_ID,
                    createdAt: favorites[i].CREATED_AT,
                })
            }
            console.log("objectFavorites: ", objectFavorites);
            return objectFavorites;
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }   
    }

    async unsetFavorite() {
        console.log("##f()## favorites_controller-> unsetFavorite method");
        let user = new User(this.username);
        if(await user.isUsername()){
            let item = new Item(this.itemId);
            if(await item.isItemId()){
                if(await this.isUserFavorite()) {
                    console.log("Sequelize promise result: ", await mysqlConnector.delete_bbdd('unsetFavorite', [ this.username, this.itemId ]));
                } else {
                    throw new FavoritesException([ [this.username, this.itemId], 'notUserFavorite' ]);
                }                 
            } else {
                throw new ItemException([this.itemId, 'isNotItem']);
            }
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }    
    }

}

const setFavorite = async (req, res, next) => {
    console.log("##f()## favorites_controller: setFavorite");
    try {
        const { itemId } = req.query;
        let favorite = new Favorites (req.user, itemId);     
        await favorite.setFavorite();  
        res.status(200).json({
            //resultCode: 2000,
            message: 'Favorite set successfully.'
        });     
        console.log("Successful favorite set response sent.");     
    } catch (err) {
        console.log("favorites_controller -> setFavorite (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException) {
            res.status(400).json({
                errorCode: err.errorCode,
                type: err.type,
                //params: err.params,
                errorMessage: err.errorMessage,
            });
        } else {
            res.status(500).json({
                errorCode: 9999,
                type: 'internal', 
                errorMessage: 'Transaction can not be completed due to internal error.'
            });
        }
        console.log("Unsuccessful favorite set response sent.");
    }
}

const queryFavorites = async (req, res, next) => {
    console.log("##f()## favorites_controller: queryFavorites");
    try {
        let favorite = new Favorites (req.user);     
        let favorites = await favorite.queryFavorites();  
        if (favorites.length > 0) {
            res.status(200).json({
                //resultCode: 2000,
                favoritesData: favorites,
                message: 'Favorites queried successfully.'
            });  
        } else {
            res.status(200).json({
                //resultCode: 2000,
                message: 'User has not favorites.'
            });  
        } 
        console.log("Successful favorite query response sent.");       
    } catch (err) {
        console.log("favorites_controller -> setFavorite (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException) {
            res.status(400).json({
                errorCode: err.errorCode,
                type: err.type,
                //params: err.params,
                errorMessage: err.errorMessage,
            });
        } else {
            res.status(500).json({
                errorCode: 9999,
                type: 'internal', 
                errorMessage: 'Transaction can not be completed due to internal error.'
            });
        }
        console.log("Unsuccessful favorite query response sent.");
    }
}

const unsetFavorite = async (req, res, next) => {
    console.log("##f()## favorites_controller: unsetFavorite");
    try {
        const { itemId } = req.query;
        let favorite = new Favorites (req.user, itemId);     
        await favorite.unsetFavorite();  
        res.status(200).json({
            //resultCode: 2000,
            message: 'Favorite unset successfully.'

        });    
        console.log("Successful favorite unset response sent.");      
    } catch (err) {
        console.log("favorites_controller -> unsetFavorite (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException) {
            res.status(400).json({
                errorCode: err.errorCode,
                type: err.type,
                //params: err.params,
                errorMessage: err.errorMessage,
            });
        } else {
            res.status(500).json({
                errorCode: 9999,
                type: 'internal', 
                errorMessage: 'Transaction can not be completed due to internal error.'
            });
        }
        console.log("Unsuccessful favorite unset response sent.");
    }
}

module.exports = { Favorites, FavoritesException, setFavorite, queryFavorites, unsetFavorite };