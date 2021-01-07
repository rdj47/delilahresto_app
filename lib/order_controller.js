let mysqlConnector = require ('./mysql_connector'),
    { profile, User, UsernameException }  = require('./user_controller'),
    { Item, ItemException } = require('./item_controller'),
    { Favorites, FavoritesException } = require('./favorites_controller');

function OrderException (exc) {
    console.log("##f()## order_controller-> OrderException");
    if (exc[1]=='isNotOrderId') {
        this.errorCode = '7001';
        this.type = 'order';
        this.params = exc;
        this.errorMessage = 'Order does not exist.'
    } else if (exc[1]=='isNotUserOrder') {
        this.errorCode = '7002';
        this.type = 'order';
        this.params = exc;
        this.errorMessage = 'Order was not created by user.'
    } else if (exc[1]=='isCurrentState') {
        this.errorCode = '7003';
        this.type = 'order';
        this.params = exc;
        this.errorMessage = 'New Order State matches current order state.'
    }
}

class Order {

    constructor ( orderId, orderItems, desc, paymentMethod, total, state , createdBy, updatedBy ) {
        this.orderId = orderId;
        this.orderItems = orderItems;
        this.desc = desc;
        this.paymentMethod = paymentMethod;
        this.state='NEW';
        this.total = total;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }

    async isOrderId() {
        console.log("##f()## order_controller-> isOrderId method");
        let order = await mysqlConnector.select_bbdd('briefQueryOrder', [ this.orderId ]);
        console.log("Sequelize promise result: ", order);
        console.log("Sequelize promise result length: ", order.length);
        if(order.length > 0) {
            return true;
        } else {
            return false;
        }            
    }

    async isUserOrder() {
        console.log("##f()## order_controller-> isUserOrder method");
        let order = await mysqlConnector.select_bbdd('briefQueryOrder', [ this.orderId ]);
        console.log("briefQueryOrder: ", order);
        if(order.find(element => element.ORDER_ID == this.orderId)) {
            if(order.find(element => element.CREATED_BY == this.createdBy)) {
                return true;
            } else {
                throw new OrderException([[this.orderId, this.createdBy], 'isNotUserOrder' ]);
            }
        } else {
            throw new OrderException([ [this.orderId, this.createdBy], 'isNotOrderId']);
        }            
    }

    async setDesc() {
        console.log("##f()## order_controller-> setDescription method");
        console.log("Order Items: ", this.orderItems);
        let orderItemIds = [];
        for (let i = 0; i < this.orderItems.length; i++) {
            orderItemIds.push(this.orderItems[i].itemId);
        }
        console.log("orderItemIds length: ", orderItemIds.length, orderItemIds );
        //return orderItemIds;
        let item = new Item();
        let itemsShortDesc = await item.queryItemsShortDesc(orderItemIds);
        console.log("Short desc: ", itemsShortDesc);
        let desc = "";
        for (let i = 0; i < this.orderItems.length; i++) {
            if (i!=0){
                desc += " ";
            } 
            desc += (this.orderItems[i].quantity+"x"+itemsShortDesc.find(element => element.ITEM_ID == this.orderItems[i].itemId).SHORT_DESC);            
        }
        console.log("Desc: ", desc);
        this.desc = desc;
    }

    async createOrder() {
        console.log("##f()## order_controller-> createOrder method");
        let user = new User(this.createdBy);
        if(await user.isUsername()){
            let areItemIds = true;
            console.log("orderItems: ", this.orderItems);
            for (let i = 0; i < this.orderItems.length; i++) {
                let item = new Item(this.orderItems[i].itemId);
                console.log("itemId: ", this.orderItems[i].orderId);
                if(!await item.isItemId()) {
                    areItemIds = false;
                    throw new ItemException([this.orderItems[i].itemId, 'isNotItem']);
                }
            }
            if(areItemIds) {
                await this.setDesc();
                console.log("Orden", this);
                let order = await mysqlConnector.insert_bbdd('createOrder', [ this.desc, this.paymentMethod, this.total, this.state, this.createdBy ]);
                this.orderId = order [0];
                let orderItemsParameters = [];
                for (let i = 0; i < this.orderItems.length; i++) {
                    orderItemsParameters.push([ this.orderId, this.orderItems[i].itemId, this.orderItems[i].quantity]);
                }
                console.log("orderItemsParameters: ", orderItemsParameters);
                console.log("Sequelize promise result: ", await mysqlConnector.insert_bbdd('createOrderItems', orderItemsParameters ));
                return this.orderId;
            } else {
                throw new ItemException([this.itemId, 'isNotItem']);
            }
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        } 
    }

    async queryUserOrders() {
        console.log("##f()## order_controller-> queryUserOrders method"); 
        let user = new User(this.createdBy);
        if(await user.isUsername()){
            if(this.orderId){
                if(await this.isUserOrder()) {
                    console.log("isUserOrder true.");
                    let userOrder = await mysqlConnector.select_bbdd('querySingleUserOrder', [ this.orderId ]);
                    console.log("Sequelize promise result: ", userOrder);
                    let userOrderItems = await mysqlConnector.select_bbdd('querySingleUserOrderItems', [ this.orderId ]);
                    let userOrderItemsObject = [];
                    for (let i=0; i<userOrderItems.length; i++) {
                        userOrderItemsObject.push({
                            itemId: userOrderItems[i].ITEM_ID,
                            name: userOrderItems[i].NAME,
                            unitPrice: userOrderItems[i].PRICE,
                            quantity: userOrderItems[i].QUANTITY
                        })
                    }
                    let userOrderObject = { 
                        orderId: userOrder[0].ORDER_ID,
                        state: userOrder[0].STATE.toLowerCase(),
                        itemsData: userOrderItemsObject,
                        total: userOrder[0].TOTAL,
                        paymentMethod: userOrder[0].PAYMENT_METHOD,
                        phone: userOrder[0].PHONE,  
                        addres: userOrder[0].ADDRESS,                        
                        createdAt: userOrder[0].CREATED_AT,
                        lastStateChangeAt: userOrder[0].LAST_STATE_CHANGE_AT
                    };
                    return [ userOrderObject ];
                } else {
                    throw new OrderException ([ this.orderId, 'isNotOrderId' ]);
                
                } 
            } else {
                console.log("Nothing.");
                let userOrders = await mysqlConnector.select_bbdd('queryUserOrders', [ this.createdBy ]);
                console.log("userOrders: ", userOrders);
                let userOrdersObject = [];
                for (let i=0; i<userOrders.length; i++) {
                    let userOrderItems = await mysqlConnector.select_bbdd('querySingleUserOrderItems', [ userOrders[i].ORDER_ID ]);
                    console.log("userOrderItems: ", userOrderItems);
                    let userOrderItemsObject = [];
                    for (let i=0; i<userOrderItems.length; i++) {
                        userOrderItemsObject.push({
                            itemId: userOrderItems[i].ITEM_ID,
                            name: userOrderItems[i].NAME,
                            unitPrice: userOrderItems[i].PRICE,
                            quantity: userOrderItems[i].QUANTITY
                        })
                    }
                    userOrdersObject.push({ 
                        orderId: userOrders[i].ORDER_ID,
                        state: userOrders[i].STATE.toLowerCase(),
                        itemsData: userOrderItemsObject,
                        total: userOrders[i].TOTAL,
                        paymentMethod: userOrders[i].PAYMENT_METHOD,
                        phone: userOrders[i].PHONE, 
                        addres: userOrders[i].ADDRESS,                        
                        createdAt: userOrders[i].CREATED_AT,
                        lastStateChangeAt: userOrders[i].LAST_STATE_CHANGE_AT
                    });
                }
                return userOrdersObject;
             }
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }   
    }

    async adminQueryOrders() {
        console.log("##f()## order_controller-> queryAdminOrders method"); 
        let userOrders = await mysqlConnector.select_bbdd('adminQueryOrders', [ ]);
        console.log("AdminUserOrders: ", userOrders);
        let userOrdersObject = [];
        for (let i=0; i<userOrders.length; i++) {
            let userOrderItems = await mysqlConnector.select_bbdd('querySingleUserOrderItems', [ userOrders[i].ORDER_ID ]);
            console.log("Sequelize promise result: ", userOrderItems);
            let userOrderItemsObject = [];
            for (let i=0; i<userOrderItems.length; i++) {
                userOrderItemsObject.push({
                    itemId: userOrderItems[i].ITEM_ID,
                    name: userOrderItems[i].NAME,
                    unitPrice: userOrderItems[i].PRICE,
                    quantity: userOrderItems[i].QUANTITY
                })
            }
            userOrdersObject.push({ 
                /*orderId: userOrders[i].ORDER_ID,
                state: userOrders[i].STATE,
                desc:  userOrders[i].DESCRIPTION,
                itemsData: userOrderItemsObject,
                total: userOrders[i].TOTAL,
                paymentMethod: userOrders[i].PAYMENT_METHOD,
                address: userOrders[i].ADDRESS,                
                createdBy: userOrders[i].CREATED_BY,
                fullname: userOrders[i].FULLNAME,
                createdAt: userOrders[i].CREATED_AT,
                lastStateChangeBy: userOrders[i].LAST_STATE_CHANGE_BY,
                lastStateChangeAt: userOrders[i].LAST_STATE_CHANGE_AT*/
                orderId: userOrders[i].ORDER_ID,
                state: userOrders[i].STATE.toLowerCase(),
                itemsData: userOrderItemsObject,
                total: userOrders[i].TOTAL,
                paymentMethod: userOrders[i].PAYMENT_METHOD,
                createdBy: userOrders[i].CREATED_BY, 
                fullname: userOrders[i].FULLNAME,  
                email: userOrders[i].EMAIL, 
                phone: userOrders[i].PHONE,    
                address: userOrders[i].ADDRESS,                 
                createdAt: userOrders[i].CREATED_AT,
                lastStateChangeBy: userOrders[i].LAST_STATE_CHANGE_BY,
                lastStateChangeAt: userOrders[i].LAST_STATE_CHANGE_AT
            });
        }
        return userOrdersObject;
    }

    async adminQueryOrderDetails() {
        console.log("##f()## order_controller-> adminQueryOrderDetails method"); 
        let user = new User(this.createdBy);
        if(await user.isUsername()){
            if(this.orderId){
                if(await this.isUserOrder()) {
                    console.log("isUserOrder true.");
                    let userOrder = await mysqlConnector.select_bbdd('querySingleUserOrder', [ this.orderId ]);
                    console.log("Sequelize promiser result: ", userOrder);
                    let userOrderItems = await mysqlConnector.select_bbdd('querySingleUserOrderItems', [ this.orderId ]);
                    console.log("Sequelize promiser result: ", userOrderItems);
                    let userOrderItemsObject = [];
                    for (let i=0; i<userOrderItems.length; i++) {
                        userOrderItemsObject.push({
                            itemId: userOrderItems[i].ITEM_ID,
                            unitPrice: userOrderItems[i].PRICE,
                            quantity: userOrderItems[i].QUANTITY
                        })
                    }
                    let userOrderObject = { 
                        orderId: userOrder[0].ORDER_ID,
                        state: userOrder[0].STATE,
                        itemsData: userOrderItemsObject,
                        total: userOrder[0].TOTAL,
                        paymentMethod: userOrder[0].PAYMENT_METHOD,
                        createdBy: userOrder[0].CREATED_BY, 
                        fullname: userOrder[0].FULLNAME,  
                        email: userOrder[0].EMAIL, 
                        phone: userOrder[0].PHONE,    
                        address: userOrder[0].ADDRESS,                 
                        createdAt: userOrder[0].CREATED_AT,
                        lastStateChangeBy: userOrder[0].LAST_STATE_CHANGE_BY,
                        lastStateChangeAt: userOrder[0].LAST_STATE_CHANGE_AT
                    };
                    return  userOrderObject;
                } 
            } 
        } else {
            throw new UsernameException([ this.username, 'isNotUsername' ]);
        }   
    }

    async deleteOrder() {
        console.log("##f()## order_controller-> deleteOrder method");
        if (await this.isOrderId()) {
            console.log(" this.orderId: ",  this.orderId);      
            let deletedOrderItems = await mysqlConnector.delete_bbdd('deleteOrderItems', [ this.orderId ]);
            console.log("Sequelize promise result: ", deletedOrderItems);      
            let deletedOrder = await mysqlConnector.delete_bbdd('deleteOrder', [ this.orderId ]);
            console.log("Sequelize promise result: ", deletedOrder);
            if(deletedOrder[0].affectedRows == 1) {
                return this.itemId;   
            } else {
                throw error;
            }
        } else {
            throw new OrderException ([ this.orderId, 'isNotOrderId' ]);
        }
    }

    async changeOrderState(newOrderState) {
        console.log("##f()## order_controller-> changeOrderState method");
        this.state = newOrderState;
        if (await this.isOrderId()) {
            let newOrderState = await mysqlConnector.update_bbdd('changeOrderState', [ this.state.toUpperCase(), this.updatedBy, this.orderId ]);
            console.log("Sequelize promise result: ", newOrderState);
            if(newOrderState[0].changedRows == 1) {
                 return this.state;
            } else {
                throw new OrderException([this.state, 'isCurrentState' ]);
            }
        } else {
            throw new OrderException ([ this.orderId, 'isNotOrderId' ]);
        }
    }
}

const createOrder = async (req, res, next) => {
    console.log("##f()## order_controller: createOrder");
    try {
        const { orderItemList, paymentMethod, total } = req.body;
        console.log("Items number: ", orderItemList.length, orderItemList);
        console.log ("Payment Method: ", paymentMethod);
        console.log("Total: ", total);
        let order = new Order (null, orderItemList, null, paymentMethod, total, null, req.user);
        console.log("Order: ", order);
        //await order.setDesc();
        //await order.createOrder();
        res.status(200).json({
            //resultCode: 2000,
            orderId: await order.createOrder(),
            message: 'Order created successfully.'

        });    
        console.log("Successful order creation response sent.");   
    } catch (err) {
        console.log("order_controller -> createOrder (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException ) {
            res.status(200).json({
                err
            });
        } else {
            if(err instanceof OrderException) {
                if (err.errorMessage == 7001) {
                    res.status(200).json({
                        err
                    });
                } else {
                    res.status(403).json({
                        err
                    });
                }
            } else {
                res.status(500).json({
                    errorCode: 9999,
                    type: 'internal', 
                    errorMessage: 'Transaction can not be completed due to internal error.'
                });
            }
        }
        console.log("Unsuccessful order creation response sent.");
    }
}

const queryUserOrders = async (req, res, next) => {
    console.log("##f()## order_controller: queryOrders");
    try {
        const { orderId } = req.query;
        console.log("orderId: ", orderId);
        let order = new Order(orderId, null, null, null, null, null, req.user);
        res.status(200).json({
            //resultCode: 2000,
            orderList: await order.queryUserOrders(),
            message: 'Order(s) queried successfully.'
        });    
        console.log("Successful order query response sent.");   
    } catch (err) {
        console.log("order_controller -> queryUserOrders (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException ) {
            res.status(200).json({
                err
            });
        } else {
            if(err instanceof OrderException) {
                if (err.errorCode == 7001) {
                    res.status(200).json({
                        errorCode: err.errorCode,
                        type: err.type,
                        params: err.params,
                        errorMessage: err.errorMessage,
                    });
                } else if (err.errorCode == 7002){
                    res.status(403).json({
                        errorCode: err.errorCode,
                        type: err.type,
                        params: err.params,
                        errorMessage: err.errorMessage,
                    });
                }
            } else {
                res.status(500).json({
                    errorCode: 9999,
                    type: 'internal', 
                    errorMessage: 'Transaction can not be completed due to internal error.'
                });
            }
        }
        console.log("Unsuccessful order query response sent.");
    }
}

const adminQueryOrders = async (req, res, next) => {
    console.log("##f()## order_controller: adminQueryOrders");
    try {
        let order = new Order ();
        res.status(200).json({
            //resultCode: 2000,
            orderList: await order.adminQueryOrders(),
            message: 'Orders queried successfully.'
        });    
        console.log("Successful admin orders query response sent."); 
    } catch (err) {
        console.log("order_controller -> adminQueryOrders (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException ) {
            res.status(200).json({
                err
            });
        } else {
            if(err instanceof OrderException) {
                if (err.errorMessage == 7001) {
                    res.status(200).json({
                        err
                    });
                } else {
                    res.status(403).json({
                        errorCode: err.errorCode,
                        type: err.type,
                        params: err.params,
                        errorMessage: err.errorMessage
                    });
                }
            } else {
                res.status(500).json({
                    errorCode: 9999,
                    type: 'internal', 
                    errorMessage: 'Transaction can not be completed due to internal error.'
                });
            }
        }
        console.log("Unsuccessful admin orders query response sent.");
    }
}

const adminQueryOrderDetails = async (req, res, next) => {
    console.log("##f()## order_controller: adminQueryOrderDetails");
    try {
        let { orderId } = req.body;
        let order = new Order (orderId, null, null, null, null, null, null, req.user);
        res.status(200).json({
            //resultCode: 2000,
            ordersList: await order.adminQueryOrderDetails(),
            message: 'Order queried successfully.'
        });    
        console.log("Successful admin order details query response sent."); 
    } catch (err) {
        console.log("order_controller -> adminQueryOrderDetails (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException ) {
            res.status(200).json({
                err
            });
        } else {
            if(err instanceof OrderException) {
                if (err.errorMessage == 7001) {
                    res.status(200).json({
                        err
                    });
                } else {
                    res.status(403).json({
                        errorCode: err.errorCode,
                        type: err.type,
                        params: err.params,
                        errorMessage: err.errorMessage
                    });
                }
            } else {
                res.status(500).json({
                    errorCode: 9999,
                    type: 'internal', 
                    errorMessage: 'Transaction can not be completed due to internal error.'
                });
            }
        }
        console.log("Unsuccessful admin order details query response sent.");
    }
}

const changeOrderState = async (req, res, next) => {
    console.log("##f()## order_controller: changeOrderState");
    try {
        let { orderId, newOrderState } = req.query;
        let order = new Order (orderId, null, null, null, newOrderState, null, null, req.user);
        await order.changeOrderState(newOrderState);
        res.status(200).json({
            //resultCode: 2000,
            //newOrderState: await order.changeOrderState(newOrderState),
            message: 'Order state changed successfully.'
        });    
        console.log("Successful admin order state change response sent."); 
    } catch (err) {
        console.log("order_controller -> changeOrderState (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException ) {
            res.status(200).json({
                err
            });
        } else {
            if(err instanceof OrderException) {
                if (err.errorMessage == 7001 || err.errorMessage == 7003) {
                    res.status(200).json({
                        err
                    });
                } else {
                    res.status(403).json({
                        errorCode: err.errorCode,
                        type: err.type,
                        params: err.params,
                        errorMessage: err.errorMessage
                    });
                }
            } else {
                res.status(500).json({
                    errorCode: 9999,
                    type: 'internal', 
                    errorMessage: 'Transaction can not be completed due to internal error.'
                });
            }
        }
        console.log("Unsuccessful admin order state change response sent.");
    }
}


const adminDeleteOrder = async (req, res, next) => {
    console.log("##f()## order_controller: adminDeleteOrder");
    try {
        let { orderId } = req.query;
        let order = new Order (orderId, null, null, null, null, null, null, req.user);
        await order.deleteOrder();
        res.status(200).json({
            //resultCode: 2000,
            //newOrderState: await order.changeOrderState(newOrderState),
            message: 'Order deleted successfully.'
        });    
        console.log("Successful admin order deletion response sent."); 
    } catch (err) {
        console.log("order_controller -> adminDeleteOrder (error): ", err);
        if (err instanceof UsernameException || err instanceof ItemException || err instanceof FavoritesException ) {
            res.status(200).json({
                err
            });
        } else {
            if(err instanceof OrderException) {
                if (err.errorMessage == 7001 || err.errorMessage == 7003) {
                    res.status(200).json({
                        err
                    });
                } else {
                    res.status(403).json({
                        errorCode: err.errorCode,
                        type: err.type,
                        params: err.params,
                        errorMessage: err.errorMessage
                    });
                }
            } else {
                res.status(500).json({
                    errorCode: 9999,
                    type: 'internal', 
                    errorMessage: 'Transaction can not be completed due to internal error.'
                });
            }
        }
        console.log("Unsuccessful admin order deletion response sent.");
    }
}

module.exports = { Order, OrderException, createOrder, queryUserOrders, adminQueryOrders, changeOrderState, adminDeleteOrder, adminQueryOrderDetails };