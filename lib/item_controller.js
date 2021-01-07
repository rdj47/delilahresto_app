const item = require('../routes/item'),
      { profile, User, UsernameException }  = require('./user_controller'),
      mysqlConnector = require ('./mysql_connector');

function ItemException (exc) {
    console.log("##f()## item_controller-> ItemException");
    if (exc[1] == 'isNotItem'){ 
        this.errorCode = '5001';
        this.type = 'item';
        this.params = exc;
        this.errorMessage = 'itemId does not exist.';
    } else if (exc[1] == 'nothingToUpdate') {
        this.errorCode = '5002';
        this.type = 'item';
        this.params = exc;
        this.errorMessage = 'There are no item parameters to be updated.';
    }
}

class Item {

    constructor ( itemId, name, shortDesc, photoUrl, price, status, addedBy, updatedBy ) {
        this.itemId=itemId;
        this.name=name;
        this.shortDesc=shortDesc;
        this.photoUrl=photoUrl;
        this.price=price;
        this.status=status;
        this.addedBy=addedBy;
        this.updatedBy=updatedBy;
    }

    async isItemId() {
        console.log("##f()## item_controller-> isItemId method");
        let promise= await mysqlConnector.select_bbdd('queryItem', [ this.itemId ]);
        console.log("Sequelize promise result: ", promise);
        if(promise.length>0) {
            console.log(this.itemId, "is itemId.");
            return true;
        } else {
            console.log(this.itemId, "is not itemId.");
            return false;
        }        
    }

    async addItem() { 
        console.log("##f()## item_controller-> addItem method");
        let user = new User(this.addedBy);
        if(await user.isUsername()){
            let addedItem = await mysqlConnector.insert_bbdd('addItem', [ this.name, this.shortDesc, this.photoUrl, this.price, this.addedBy ]);
            console.log ("Sequelize promise result: ", addedItem);
            console.log ("addedItem[0]: ", addedItem[0]);
            return addedItem[0];
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }     
    }

    async queryItems() {
        console.log("##f()## item_controller-> queryItems method");
        let user = new User(this.addedBy);
        if(await user.isUsername()){
            if(this.itemId) {
                if(await this.isItemId()){
                    let item =  await mysqlConnector.select_bbdd('queryItem', [ this.itemId ]);
                    console.log("Sequelize promise result: ", item);
                    return [{ 
                        itemId: item[0].ITEM_ID,
                        name: item[0].NAME,
                        shortDesc: item[0].SHORT_DESC ,
                        photoUrl: item[0].PHOTO_URL,
                        price: item[0].PRICE,
                        //status: item[0].STATUS,
                        createdBy: item[0].CREATED_BY,
                        createdAt: item[0].CREATED_AT,
                        updatedBy: item[0].UPDATED_BY,
                        updatedAt: item[0].UPDATED_AT,
                    }];
                } else {
                    throw new ItemException([ this.itemId, 'isNotItem' ]);
                }
            } else {
                let items =  await mysqlConnector.select_bbdd('queryItems', [ ]);
                console.log("Sequelize promise result: ", items);
                let itemsObject = [];
                if (items.length != 0){
                    items.forEach(element => {
                        itemsObject.push({
                            itemId: element.ITEM_ID,
                            name: element.NAME,
                            shortDesc: element.SHORT_DESC ,
                            photoUrl: element.PHOTO_URL,
                            price: element.PRICE,
                            //status: element.STATUS,
                            createdBy: element.CREATED_BY,
                            createdAt: element.CREATED_AT,
                            updatedBy: element.UPDATED_BY,
                            updatedAt: element.UPDATED_AT,
                        });
                    });
                    
                } 
                return itemsObject;
            }      
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }        
    }

    async updateItem() {
        console.log("##f()## item_controller-> updateItem method");
        let user = new User(this.updatedBy);        
        if(await user.isUsername()) {
            if(await this.isItemId()){
                let updatedItem = await mysqlConnector.update_bbdd('updateItem', [ this.name, this.shortDesc, this.photoUrl, this.price, this.updatedBy, this.itemId ]);
                console.log("Sequelize promise result: ", item);
                console.log("updatedItem[0].changedRows: ", updatedItem[0].changedRows);
                if(updatedItem[0].changedRows == 1) {
                    return this.itemId;   
                } else {
                    throw new ItemException([this.itemId, 'nothingToUpdate']);
                }
            } else {
                throw new ItemException([this.itemId, 'isNotItem']);
            }
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }      
    }

    async deleteItem() {
        console.log("##f()## item_controller-> deleteItem method");
        let user = new User(this.updatedBy);        
        if(await user.isUsername()) {
            if(await this.isItemId()) {
                let deletedItemInFav = await mysqlConnector.delete_bbdd('deleteItemInFav', [ this.itemId ] );
                console.log("Sequelize promise result: ", deletedItemInFav);
                console.log("deletedItem[0].affectedRows: ", deletedItemInFav[0].affectedRows);
                let setItemAsDeleted = await mysqlConnector.update_bbdd('setItemAsDeleted', [ this.updatedBy, this.itemId ] );
                console.log("Sequelize promise result: ", setItemAsDeleted);
                console.log("deletedItem[0].changedRows: ", setItemAsDeleted[0].changedRows);
                if(setItemAsDeleted [0].changedRows == 1) {
                    return this.itemId;   
                } else {
                    throw error;
                }
            } else {
                throw new ItemException([this.itemId, 'isNotItem']);
            }
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }      
    }

    async queryItemsShortDesc(orderItemIds) {
        console.log("##f()## item_controller-> queryItemsshortDesc method");
        return await mysqlConnector.select_bbdd('queryItemsShortDesc', orderItemIds );

    } 
}    

const addItem = async (req, res, next) => {
    console.log("##f()## item_controller: addItem");
    try {
        const { name, shortDesc, photoUrl, price, status } = req.body.newItemData;
        let item = new Item (null, name, shortDesc, photoUrl, price, status, req.user, null);
        res.status(200).json({
            //resultCode: '200',
            itemId: await item.addItem(),
            message: "Item added successfully.",
        });                         
        console.log("Successful item addition response sent.");
        /*console.log("Error original errno: ",err.original);
        console.log("Error original errno: ",err.original.errno);
        console.log("Error original sqlState: ",err.original.sqlState);
        console.log("Error original sqlMessage: ",err.original.sqlMessage);
        console.log("Error original sql: ",err.original.sql);
        console.log("Error sql: ",err.sql);*/
    } catch (err) {
        console.log("item_controller -> addItem (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException) {
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
        console.log("Unsuccessful item addition response sent.");
    }    
}

const queryItems = async (req, res, next) => {
    console.log("##f()## item_controller -> queryItems");
    try{
        const { itemId } = req.query;
        console.log("itemId: ",itemId);   
        let item = new Item(itemId, null, null, null, null, null, req.user);
        res.status(200).json({
            //resultCode: 200,
            itemList:  await item.queryItems(),
            message: 'Item(s) queried successfully.'  
        });      
    } catch (err) {
        console.log("item_controller -> queryItem (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException) {
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
        console.log("Unsuccessful item query response sent.");
    }
}

const updateItem = async (req, res, next) => {
    console.log("##f()## item_controller -> updateItem");
    try{
        const { itemId } = req.body;
        const { name, shortDesc, photoUrl, price } = req.body.newItemData;
        let item = new Item (itemId, name, shortDesc, photoUrl, price, null, null, req.user);
        await item.updateItem();
        res.status(200).json({
            //resultCode: 200,
            //itemId:  ,
            message: 'Item updated successfully.'  
        });       
    } catch (err) {
        console.log("item_controller -> updateItem (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException) {
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
        console.log("Unsuccessful item update response sent.");
    }
}

const deleteItem = async (req, res, next) => {
    console.log("##f()## item_controller -> deleteItem");
    try{
        const { itemId } = req.query;
        let item = new Item (itemId, null, null, null, null, null, null, req.user);
        await item.deleteItem();
        res.status(200).json({
            //resultCode: 200,
            //itemId:  await item.deleteItem(),
            message: 'Item deleted successfully.'  
        });        
    } catch (err) {
        console.log("item_controller -> deleteItem (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException) {
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
        console.log("Unsuccessful item deletion response sent.");
    }
}

module.exports = { Item, ItemException, addItem, queryItems, updateItem, deleteItem };