const { profile, User, AuthorizationException }  = require('../lib/user_controller');

function ParamsException (exc) {
    console.log("##f()## particular_middleware-> ParamsException");
    console.log("exc[1]: ", exc[1]);
    switch(exc[1]) {

        case 'noNewUserData': 
            this.errorCode = '1499';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'newUserData is missing.';
            break;

        case 'usernameIsMissing': 
            this.errorCode = '1501';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'username is missing.';
            break;
        
        case 'invalidUsername': 
            this.errorCode = '1502';
            this.type = 'user';
            //this.params = exc;
            this.errorMessage = 'username is not valid. Only alpha-numeric values are allowed.';
            break;
        
        case 'fullnameIsMissing': {
            this.errorCode = '1503';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'fullname is missing.';
            break;
        }
        case "invalidFullname": 
            this.errorCode = '1504';
            this.type = 'user';
            //this.params = exc;
            this.errorMessage = 'fullname is not valid. Only letters are allowed.';
            break;
        
        case 'emailIsMissing': 
            this.errorCode = '1505';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'email is missing.';
            break;
        
        case 'invalidEmail': 
            this.errorCode = '1506';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'email is not valid. Follow the example: user@example.com';
            break;

        case 'phoneIsMissing': 
            this.errorCode = '1505';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'phone is missing.';
            break;
        
        case 'invalidPhone': 
            this.errorCode = '1506';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'phone is not valid. Follow the example: 541199999999.';
            break;

        case 'addressIsMissing': 
            this.errorCode = '1507';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'address is missing.';
            break;
        
        case 'invalidAddress': 
            this.errorCode = '1508';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'address is too long. user 256 characters as maximun.';
            break;
        
        case 'passwordIsMissing': 
            this.errorCode = '1509';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'password is missing.';
            break;
        
        case 'invalidPassword': 
            this.errorCode = '1510';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'password is not valid. Use 6-12 characters, includes at least a number and a special character [ !@#$%^&* ].';
            break;   
        
        case 'roleIsMissing': 
            this.errorCode = '1511';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'role is missing.';
            break;
        
        case 'invalidRole': 
            this.errorCode = '1512';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'role is not valid. Only values -customer- or -admin- are allowed.';
            break; 
            
        case 'noNewItemData': 
            this.errorCode = '1549';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'newItemData is missing.';
            break;

        case 'itemNameIsMissing': 
            this.errorCode = '1550';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item name is missing.';
            break;
        
        case 'invalidItemName': 
            this.errorCode = '1551';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item name is too long. Use 100 characters as maximun. ';
            break;     
            
        case 'shortDescIsMissing': 
            this.errorCode = '1552';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item shortDesc is missing.';
            break;
        
        case 'invalidShortDesc': 
            this.errorCode = '1553';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item shortDesc is too long. Use 9 characters as maximun. ';
            break;   
        
        case 'photoUrlIsMissing': 
            this.errorCode = '1552';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item photoUrl is missing. Use 256 characters as maximun.';
            break;
        
        case 'invalidPhotoUrl': 
            this.errorCode = '1553';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'photoUrl is too long. ';
            break;

        case 'priceIsMissing': 
            this.errorCode = '1552';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item price is missing. ';
            break;
        
        case 'invalidPrice': 
            this.errorCode = '1553';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item price is not valid. Only numbers are allowed.'
            break;   
        
        case 'invalidItemId': 
            this.errorCode = '1554';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'itemId is not valid. Only numbers are allowed.'
            break;   

        case 'itemIdIsMissing': 
            this.errorCode = '1555';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'ItemId is missing.'
            break;   
        
        case 'noParamsToUpdate': 
            this.errorCode = '1556';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'At least, an item parameter must be included in the request.'
            break; 
        
        case 'orderItemListIsMissing ': 
            this.errorCode = '1600';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Order item list was not include in the request.'
            break;             
  
        case 'quantityIsMissing': 
            this.errorCode = '1601';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item quantity is missing.'
            break;
        
        case 'invalidQuantity': 
            this.errorCode = '1602';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item quantity is not valid. Only integers are allowed. -0- is not allowed.'
            break; 

        case 'paymentMethodIsMissing': 
            this.errorCode = '1603';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Payment Method is missing.'
            break;
        
        case 'invalidPaymentMethod': 
            this.errorCode = '1604';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Payment Method is not valid. Only values -cash- or -card- are allowed.'
            break;            
        
        case 'totalIsMissing': 
            this.errorCode = '1605';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Total is missing.'
            break;
        
        case 'invalidTotal': 
            this.errorCode = '1606';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Totat is not valid. Only numbers are allowed.'
            break;   
        
        case 'itemQuantityIsNotSummarized': 
            this.errorCode = '1607';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Item quantity is not summarized. An itemId must be included only once in the order item list.';
            break;   
        
        case 'orderIdIsMissing': 
            this.errorCode = '1608';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Order ID is missing.';
            break; 

        case 'invalidOrderId': 
            this.errorCode = '1609';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Order ID is not valid. Only integers are allowed.';
            break;   

        case 'totalIsMissing': 
            this.errorCode = '1610';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Total is missing.'
            break;
        
        case 'invalidTotal': 
            this.errorCode = '1611';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Totat is not valid. Only numbers are allowed.'
            break;   
s
        case 'newOrderStateIsMissing': 
            this.errorCode = '1608';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'Order ID is not valid. Only integers are allowed.';
            break; 

        case 'invalidNewOrderState': 
            this.errorCode = '1609';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'New Order State is not valid. Only -new-, -confirmed-, -preparing-, -on_the_way-, -cancelled-, -delivered- are allowed.';
            break;   

            

        default : 
            this.errorCode = '1599';
            this.type = 'requestParameters';
            //this.params = exc;
            this.errorMessage = 'There is a issue with some parameter in the request.';
            break;
    }
}

const onlyAdmin = async (req, res, next) => {
    console.log("##f()## particular_middleware -> onlyAdmin");
    try {
        let user = new User(req.user);
        let userData = await user.queryUser();
        console.log("Sequelize promise result: ", userData);
        console.log("userData[0].ROLE: ", userData.role);
        if (userData.role == 'admin') {
            next();
        } else {
            throw new AuthorizationException([this.username, 'isNotAdmin']);
        }        
 
    } catch (err) {
        console.log("particular_middleware -> onlyAdmin (error):", err);
        res.status(503).json({
            errorCode: 500,
            message: "There was an error in admin role verification."
        });
        console.log("Unsuccessful admin role verification response sent.");
    }
}

const usernameMatchesToken = (req, res, next) => {
    console.log("##f()## particular_middleware -> usernameMatchesToken");
}

const chkParamsCreateUser = (req, res, next) => {
    try {
        console.log("##f()## particular_middleware -> chkParamsCreateUser");
        const { newUserData } = req.body
        if(newUserData) {
            const { username, fullname, email, phone, address, password, role } = req.body.newUserData;
            console.log("!username: ", !username);
            if(username) {
                if(/^([A-Za-z0-9])*$/.test(username)) {
                    console.log("Valid username.");
                } else {
                    throw new ParamsException ([ username, 'invalidUsername' ]);
                }
            } else {
                throw new ParamsException ([ username, 'usernameIsMissing' ]);
            }
            if(fullname) {
                if(/^([A-Za-z\s])*$/.test(fullname)) {
                    console.log("Valid fullname.");
                } else {
                    throw new ParamsException ([fullname, 'invalidFullname' ]);
                }
            } else {
                throw new ParamsException ([ fullname, 'fullNameIsMissing' ]);
            }
            if(email) {
                if(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(email)) {
                    console.log("Valid email.");
                } else {
                    throw new ParamsException ([ email, 'invalidEmail' ]);
                }
            } else {
                throw new ParamsException ([ email, 'emailIsMissing' ]);
            }
            if(phone) {
                if(/^([5][4])?[0-9]{10}$/.test(phone)) {
                    console.log("Valid phone.");
                } else {
                    throw new ParamsException ([ phone, 'invalidPhone' ]);
                }
            } else {
                throw new ParamsException ([ phone, 'phoneIsMissing' ]);
            }
            if(phone) {
                if(/^([5][4])?[0-9]{10}$/.test(phone)) {
                    console.log("Valid phone.");
                } else {
                    throw new ParamsException ([ phone, 'invalidPhone' ]);
                }
            } else {
                throw new ParamsException ([ phone, 'phoneIsMissing' ]);
            }
            if(address) {
                //if(/^([5][4])?[0-9]{10}$/.test(phone)) {
                    console.log("Valid address.");
                /*} else {
                    throw new ParamsException ([ phone, 'invalidPhone' ]);
                }*/
            } else {
                throw new ParamsException ([ address, 'addressIsMissing' ]);
            }
            if(password) {
                if(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/.test(password)) {
                    console.log("Valid password.");
                } else {
                    throw new ParamsException ([ password, 'invalidPassword' ]);
                }
            } else {
                throw new ParamsException ([ password, 'passwordIsMissing' ]);
            }
            if(role) {
                if( role == 'customer' || role == 'admin') {
                    console.log("Valid role.");
                } else {
                    throw new ParamsException ([ role, 'invalidRole' ]);
                }
            } else {
                throw new ParamsException ([ role, 'roleIsMissing' ]);
            }
        } else {
            throw new ParamsException ([ null, 'noNewUserData' ]);
        }
        next();
        /*else {
            res.status(400).json({
                errorCode: ,
                message: "Some compulsary parameters are missing in addItem request"
            });
            console.log("Unsuccessful item addition response sent.");
        }*/
    } catch (err) {
        console.log("particular_middleware-> checkParamsCreateUser (error): ", err);
        if (err instanceof ParamsException) {
            res.status(200).json({
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
        console.log("Unsuccessful checkParamsCreateUser response sent.");
    }    
}

const chkParamsLogin = (req, res, next) => {
    try {
        console.log("##f()## particular_middleware -> chkParamsLogin");
        const { username, password } = req.body;
        if(username) {
            if(/^([A-Za-z0-9])*$/.test(username)) {
                console.log("Valid username.");
            } else {
                throw new ParamsException ([ username, 'invalidUsername' ]);
            }
        } else {
            throw new ParamsException ([ username, 'usernameIsMissing' ]);
        }
        if(!password) {
            throw new ParamsException ([ password, 'passwordIsMissing' ]);
        }
        next();
    } catch (err) {
        console.log("particular_middleware-> chkParamsLogin (error): ", err);
        if (err instanceof ParamsException) {
            res.status(200).json({
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
        console.log("Unsuccessful chkParamsLogin response sent.");
    }    
}

const chkParamsAddItem = (req, res, next) => {
    console.log("##f()## particular_middleware -> chkParamsAddItem");
    try{ 
        const { newItemData } = req.body;
        if(newItemData) {
            const { name, shortDesc, photoUrl, price } = req.body.newItemData;
            if(name) {
                if(name.length <= 100 ) {
                    console.log("Valid itemName.");
                } else {
                    throw new ParamsException ([ name, 'invalidItemName' ]);
                }
            } else {
                throw new ParamsException ([ name, 'itemNameIsMissing' ]);
            }
            if(shortDesc) {
                if(shortDesc.length <= 9 ) {
                    console.log("Valid shortDesc.");
                } else {
                    throw new ParamsException ([ shortDesc, 'invalidShortDesc' ]);
                }
            } else {
                throw new ParamsException ([ shortDesc, 'shortDescIsMissing' ]);
            }
            if(photoUrl) {
                if(photoUrl.length <= 256 ) {
                    console.log("Valid photoUrl.");
                } else {
                    throw new ParamsException ([ photoUrl, 'invalidPhotoUrl' ]);
                }
            } else {
                throw new ParamsException ([ photoUrl, 'photoUrlIsMissing' ]);
            }
            if(price) {
                console.log("!isNaN(price): ", !isNaN(price));
                if(!isNaN(price)) {                
                    console.log("Valid price.");
                } else {
                    throw new ParamsException ([ price, 'invalidPrice' ]);
                }
            } else {
                throw new ParamsException ([ price, 'priceIsMissing' ]);
            }
        } else {
            throw new ParamsException ([ null, 'noNewItemData' ]);
        }
        next();

    } catch (err) {
        console.log("particular_middleware-> chkParamsAddItem (error): ", err);
        if (err instanceof ParamsException) {
            res.status(200).json({
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
        console.log("Unsuccessful chkParamsAddItem response sent.");
    } 
}


const chkParamsQueryItems = (req, res, next) => {
    console.log("##f()## particular_middleware -> chkParamsQueryItems");
    try{ 
        const { itemId } = req.query;
        if(itemId) {
            if(Number.isInteger(parseInt(itemId)))  {
                console.log("Valid itemId.");
            } else {
                throw new ParamsException ([ itemId, 'invalidItemId' ]);
            }
        } 
        next();

    } catch (err) {
        console.log("particular_middleware-> chkParamsQueryItems (error): ", err);
        if (err instanceof ParamsException) {
            res.status(200).json({
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
        console.log("Unsuccessful chkParamsQueryItems response sent.");
    } 
}
/*const chkParamsQueryItem = (req, res, next) => {
    console.log("##f()## particular_middleware -> chkParamsQueryItem");
    const { itemId } = req.body;
    if(itemId) {
        next();
    } else {
        res.status(400).json({
            errorCode: 400,
            message: "Some compulsary parameters are missing in query request."
        });
        console.log("Unsuccessful item query response sent.");
    }
}*/

const chkParamsUpdateItem = (req, res, next) => {
    console.log("##f()## particular_middleware -> chkParamsUpdateItems");
    try{ 
        const { itemId, newItemData } = req.body;
        
        if(itemId) {
            if(Number.isInteger(parseInt(itemId))) {
                console.log("Valid itemId.");
            } else {
                throw new ParamsException ([ itemId, 'invalidItemId' ]);
            }
            if(newItemData) {
                const { name, shortDesc, photoUrl, price } = req.body.newItemData;
                if (name || shortDesc ||  photoUrl || price) {
                    if(name) {
                        if(name.length <= 100 ) {
                            console.log("Valid itemName.");
                        } else {
                            throw new ParamsException ([ name, 'invalidItemName' ]);
                        }
                    } 
                    if(shortDesc) {
                        if(shortDesc.length <= 9 ) {
                            console.log("Valid shortDesc.");
                        } else {
                            throw new ParamsException ([ shortDesc, 'invalidShortDesc' ]);
                        }
                    } 
                    if(photoUrl) {
                        if(photoUrl.length <= 256 ) {
                            console.log("Valid photoUrl.");
                        } else {
                            throw new ParamsException ([ photoUrl, 'invalidPhotoUrl' ]);
                        }
                    }
                    if(price) {
                        console.log("!isNaN(price): ", !isNaN(price));
                        if(!isNaN(price)) {                
                            console.log("Valid price.");
                        } else {
                            throw new ParamsException ([ price, 'invalidPrice' ]);
                        }
                    }
                } else {
                    throw new ParamsException ([ itemId, 'noParamsToUpdate' ]);
                }
            } else {
                throw new ParamsException ([ null, 'noNewItemData' ]);
            }
        } else {
            throw new ParamsException ([ itemId, 'itemIdIsMissing' ]);
        }
        next();

    } catch (err) {
        console.log("particular_middleware-> chkParamsUpdateItems (error): ", err);
        if (err instanceof ParamsException) {
            res.status(200).json({
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
        console.log("Unsuccessful chkParamsUpdateItems response sent.");
    } 
}

const chkParamsDeleteItem = (req, res, next) => {
    console.log("##f()## particular_middleware -> chkParamsDeleteItem");
    try{ 
        const { itemId } = req.query;
        if(itemId) {
            if(Number.isInteger(parseInt(itemId))) {
                console.log("Valid itemId.");
            } else {
                throw new ParamsException ([ itemId, 'invalidItemId' ]);
            }
        } else {
            throw new ParamsException ([ itemId, 'itemIdIsMissing' ]);
        }
        next();

    } catch (err) {
        console.log("particular_middleware-> chkParamsDeleteItem (error): ", err);
        if (err instanceof ParamsException) {
            res.status(200).json({
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
        console.log("Unsuccessful chkParamsDeleteItem response sent.");
    } 
}

//Favorite services shares parameters filter of deleteItem
const chkParamsFavorites = chkParamsDeleteItem;

const chkParamsCreateOrder = (req, res, next) => {
    console.log("##f()## particular_middleware -> chkParamsCreateOrder");
    try{ 
        const { orderItemList, paymentMethod, total } = req.body;
        if(orderItemList) {
            orderItemList.forEach(element => {
                if(element.itemId) {
                    if(Number.isInteger(parseInt(element.itemId))) {
                        //if(orderItemList.filter( item => item.itemId == element.itemId) == 1) {
                            console.log(element.itemId, "is valid itemId."); 
                        /*}  else {
                            throw new ParamsException ([ element.itemId, 'itemQuantitiesNotSummarized' ]);
                        }     */                  
                    } else {
                        throw new ParamsException ([ element.itemId, 'invalidItemId' ]);
                    }  
                } else {
                    throw new ParamsException ([ element.itemId, 'itemIdIsMissing' ]);
                }   
                console.log("element.quantity: ", element.quantity);
                if(element.quantity != undefined) {
                    if(Number.isInteger(element.quantity) && element.quantity != 0) {
                        console.log(element.quantity, "is valid quantity.");                  
                    } else {
                        throw new ParamsException ([ element.quantity, 'invalidQuantity' ]);
                    }  
                } else {
                    throw new ParamsException ([ element.quantity, 'quantityIsMissing' ]);
                }           
            });
        } else {
            throw new ParamsException ([ orderItemList, 'orderItemListIsMissing' ]);
        }
        let oil = orderItemList.slice();
        for(let i = 0; i < orderItemList.length; i++) {
            //console.log("orderItemList[i].itemId: ", orderItemList[i].itemId);
            //console.log("Item serie: ", oil.filter(item =>  item.itemId == orderItemList[i].itemId ));
            //console.log("Item serie length: ", oil.filter(item =>  item.itemId == orderItemList[i].itemId ).length);
            if(oil.filter(item =>  item.itemId == orderItemList[i].itemId ).length == 1) {
                console.log("Item quantities are summarized."); 
            } else {
                throw new ParamsException ([ orderItemList[i].itemId, 'itemQuantityIsNotSummarized' ]);
            }
        }
        if(paymentMethod) {
            if(paymentMethod == 'cash' || paymentMethod == 'card')  {
                console.log("Valid paymentMethod.");
            } else {
                throw new ParamsException ([ paymentMethod, 'invalidPaymentMethod' ]);
            }
        } else {
            throw new ParamsException ([ paymentMethod, 'paymentMethodIsMissing' ]);
        }
        if(total) {
            if(!isNaN(total) ) {
                console.log("Valid total.");
            } else {
                throw new ParamsException ([ total, 'invalidTotal' ]);
            }
        } else {
            throw new ParamsException ([ total, 'totalIsMissing' ]);
        }
        next();

    } catch (err) {
        console.log("particular_middleware-> chkParamsCreateOrder (error): ", err);
        if (err instanceof ParamsException) {
            res.status(200).json({
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
        console.log("Unsuccessful chkParamsCreateorder response sent.");
    } 
}

const chkParamsQueryUserOrders = (req, res, next) => {
    console.log("##f()## particular_middleware -> chkParamsQueryUserOrders");
    try{ 
        const { orderId } = req.query;
        if(orderId) {
            console.log("Number.isInteger(orderId): ", orderId);
            console.log("Number.isInteger(orderId): ", Number.isInteger(orderId));
            if(Number.isInteger(parseInt(orderId))) {
                console.log("Valid orderId.");
            } else {
                throw new ParamsException ([ orderId, 'invalidOrderId' ]);
            }
        } 
        next();

    } catch (err) {
        console.log("particular_middleware-> chkParamsQueryUserOrders (error): ", err);
        if (err instanceof ParamsException) {
            res.status(200).json({
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
        console.log("Unsuccessful chkParamsQueryUserOrders response sent.");
    } 
}

const chkParamsChangeOrderState = (req, res, next) => {
    try {
        console.log("##f()## particular_middleware -> chkParamsChangeOrderState");
        const { orderId, newOrderState } = req.query;
        if(orderId) {
            if(Number.isInteger(parseInt(orderId))) {
                console.log("Valid orderId.");
            } else {
                throw new ParamsException ([ orderId, 'invalidOrderId' ]);
            }
        } else {
            throw new ParamsException ([ orderId, 'orderIdIsMissing' ]);
        }
        //a.STATE="NEW" DESC, a.STATE="CONFIRMED" DESC, a.STATE="PREPARING" DESC, a.STATE="CONFIRMED" DESC, a.STATE="ON_THE_WAY" DESC, a.STATE="CANCELLED" DESC, a.STATE="DELIVERED" DESC
        if(newOrderState) {
            if(newOrderState == 'new' || newOrderState == 'confirmed' || newOrderState == 'preparing' || newOrderState == 'confirmed' || newOrderState == 'on_the_way' || newOrderState == 'cancelled' || newOrderState == 'delivered') {
                console.log("Valid newOrderState.");
            } else {
                throw new ParamsException ([ newOrderState, 'invalidNewOrderState' ]);
            }
        } else {
            throw new ParamsException ([ newOrderState, 'newOrderStateIsMissing' ]);
        }
        next();
    } catch (err) {
        console.log("particular_middleware-> chkParamsChangeOrderState (error): ", err);
        if (err instanceof ParamsException) {
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
        console.log("Unsuccessful chkParamsChangeOrderState response sent.");
    }    
}

const chkParamsAdminDeleteOrder = (req, res, next) => {
    try {
        console.log("##f()## particular_middleware -> chkParamsAdminDeleteOrder");
        const { orderId } = req.query;
        if(orderId) {
            if(Number.isInteger(parseInt(orderId))) {
                console.log("Valid orderId.");
            } else {
                throw new ParamsException ([ orderId, 'invalidOrderId' ]);
            }
        } else {
            throw new ParamsException ([ orderId, 'orderIdIsMissing' ]);
        }
        next();
    } catch (err) {
        console.log("particular_middleware-> chkParamsAdminDeleteOrder (error): ", err);
        if (err instanceof ParamsException) {
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
        console.log("Unsuccessful chkParamsAdminDeleteOrder response sent.");
    }    
}

module.exports = { onlyAdmin, chkParamsCreateUser, chkParamsLogin, chkParamsAddItem, chkParamsQueryItems, chkParamsUpdateItem, chkParamsUpdateItem, chkParamsDeleteItem, chkParamsFavorites, chkParamsCreateOrder, chkParamsQueryUserOrders, chkParamsChangeOrderState, chkParamsAdminDeleteOrder};