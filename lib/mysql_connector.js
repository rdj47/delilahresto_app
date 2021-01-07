const { query } = require('express');
const Sequelize = require ('sequelize');
const sequelize = new Sequelize ('mysql://root:root@localhost:3307/delilahresto2');  

async function insert_bbdd (type, parameters) {
    console.log("##f()## mysql_connector -> insert_bbdd ");

        if (type == 'createUser') {
            return await sequelize.query('INSERT INTO `users` (`USERNAME`, `FULLNAME`, `EMAIL`, `PHONE`, `ADDRESS`, `PASSWORD`, `ROLE`) VALUES (?,?,?,?,?,?,?)',
                { replacements: parameters, type: sequelize.QueryTypes.INSERT }
            )
        }

        if (type == 'addItem') {
            return await sequelize.query('INSERT INTO `items` (`NAME`, `SHORT_DESC`, `PHOTO_URL`, `PRICE`, `CREATED_BY`) VALUES (?,?,?,?,?)',
                { replacements: parameters, type: sequelize.QueryTypes.INSERT }
            )
        }

        if (type == 'setFavorite') {
            return await sequelize.query('INSERT INTO `favorites` (`USERNAME`, `ITEM_ID`) VALUES (?,?)',
                { replacements: parameters, type: sequelize.QueryTypes.INSERT }
            )
        }

        if (type == 'createOrder') {
            return await sequelize.query('INSERT INTO `orders` (DESCRIPTION, PAYMENT_METHOD, TOTAL, STATE, CREATED_BY) VALUES (?,?,?,?,?)',
                { replacements: parameters, type: sequelize.QueryTypes.INSERT }
            )
        }

        if (type == 'createOrderItems') {
            for (let i = 0; i < parameters.length; i++) {
                await sequelize.query('INSERT INTO `order_items` (ORDER_ID, ITEM_ID, QUANTITY) VALUES (?,?,?)',
                    { replacements: parameters[i], type: sequelize.QueryTypes.INSERT }
                )
            }    
        }
}

async function select_bbdd (type, parameters) {
    console.log("##f()## mysql_connector -> query_bbdd ");
        if (type == 'queryUser') {
            return await sequelize.query('SELECT * FROM `users` WHERE `USERNAME`=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }
        if (type == 'queryItem') {
            return await sequelize.query('SELECT * FROM `items` WHERE `ITEM_ID`=? AND STATUS <> "DELETED"',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }

        if (type == 'queryItems') {
            return await sequelize.query('SELECT * FROM `items` WHERE STATUS <> "DELETED"',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }

        if (type == 'queryFavorites') {
            return await sequelize.query('SELECT * FROM `favorites` WHERE `USERNAME`=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }

        if (type == 'querySingleFavorite') {
            return await sequelize.query('SELECT * FROM `favorites` WHERE `USERNAME`=? AND `ITEM_ID`=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }

        if (type == 'queryItemsShortDesc') {
            console.log ("Parameters length: ", parameters.length);
            let queryValues = "";
            for (let i = 0; i < parameters.length; i++) {
                if(i == 0) {
                    queryValues = "`ITEM_ID`=?";
                } else {
                    queryValues += " OR `ITEM_ID`=?";
                }
            }
            console.log("queryValues: ",queryValues);
            return await sequelize.query('SELECT ITEM_ID, SHORT_DESC FROM `items` WHERE '+queryValues,
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }

        if (type == 'briefQueryOrder') {
            return await sequelize.query('SELECT ORDER_ID, CREATED_BY FROM `orders` WHERE `ORDER_ID`=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }

        if (type == 'querySingleUserOrder') {
            //return await sequelize.query('SELECT `a.ORDER_id`, `a.DESCRIPTION`, `a.PAYMENT_METHOD`, `a.TOTAL`, `a.STATE`, `b.ADDRESS`, `a.CREATED_BY`, `a.CREATED_AT`, `a.LAST_CHANGE_STATE_BY`, `a.LAST_CHANGE_STATE_AT` FROM `orders` AS `a` INNER JOIN `users` AS `b` ON `a.CREATED_BY`=`b.USERNAME` WHERE `ORDER_ID`=8',
            return await sequelize.query('SELECT a.ORDER_ID, a.DESCRIPTION, a.PAYMENT_METHOD, a.TOTAL, a.STATE, a.CREATED_BY, b.FULLNAME, b.EMAIL, b.PHONE, b.ADDRESS, a.CREATED_AT, a.LAST_STATE_CHANGE_BY, a.LAST_STATE_CHANGE_AT FROM orders AS a INNER JOIN users AS b ON a.CREATED_BY=b.USERNAME WHERE a.ORDER_ID=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }

        if (type == 'querySingleUserOrderItems') {
            /*return await sequelize.query('SELECT a.ORDER_ID, a.ITEM_ID, b.PRICE, a.QUANTITY FROM order_items AS a INNER JOIN items AS b ON a.ITEM_ID=b.ITEM_ID WHERE ORDER_ID=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )*/
            return await sequelize.query('SELECT a.ORDER_ID, a.ITEM_ID, b.NAME, b.PRICE, a.QUANTITY FROM order_items AS a INNER JOIN items AS b ON a.ITEM_ID=b.ITEM_ID WHERE ORDER_ID=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
        )
        }

        if (type == 'queryUserOrders') {
            return await sequelize.query('SELECT a.ORDER_ID, a.DESCRIPTION, a.PAYMENT_METHOD, a.TOTAL, a.STATE, a.CREATED_BY, b.FULLNAME, b.EMAIL, b.PHONE, b.ADDRESS, a.CREATED_AT, a.LAST_STATE_CHANGE_BY, a.LAST_STATE_CHANGE_AT FROM orders AS a INNER JOIN users AS b ON a.CREATED_BY=b.USERNAME WHERE a.CREATED_BY=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }

        if (type == 'adminQueryOrders') {
            return await sequelize.query('SELECT a.ORDER_ID, a.DESCRIPTION, a.PAYMENT_METHOD, a.TOTAL, a.STATE, a.CREATED_BY, b.FULLNAME, b.EMAIL, b.PHONE, b.ADDRESS, a.CREATED_AT, a.LAST_STATE_CHANGE_BY, a.LAST_STATE_CHANGE_AT FROM orders AS a INNER JOIN users AS b ON a.CREATED_BY=b.USERNAME ORDER BY a.STATE="NEW" DESC, a.STATE="CONFIRMED" DESC, a.STATE="PREPARING" DESC, a.STATE="ON_THE_WAY" DESC, a.STATE="CANCELLED" DESC, a.STATE="DELIVERED" DESC, a.CREATED_AT DESC',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }
        /*if (type == 'confirmItemCreation') {
            return await sequelize.query('SELECT * FROM `datos_personales` WHERE `id`=?',
                { replacements: parameters, type: sequelize.QueryTypes.SELECT }
            )
        }*/
}

async function update_bbdd (type, parameters) {
    console.log("##f()## mysql_connector -> update_bbdd ");
        let final_parameters = [];
        if (type == 'updateItem') {
            let queryStatement="";
            if (parameters[0]!=null) {
                queryStatement = "`NAME`=?";
                final_parameters.push(parameters[0]);
            }
            if (parameters[1]!=null) {
                if(queryStatement=="") {
                    queryStatement = "`SHORT_DESC`=?";
                } else {
                    queryStatement += ", `SHORT_DESC`=?";
                }
                final_parameters.push(parameters[1]);
            }
            if (parameters[2]!=null) {
                if(queryStatement=="") {
                    queryStatement = "`PHOTO_URL`=?";
                } else {
                    queryStatement += ",`PHOTO_URL`=?";
                }
                final_parameters.push(parameters[2]);
            }
            if (parameters[3]!=null) {
                if(queryStatement=="") {
                    queryStatement = "`PRICE`=?";
                } else {
                    queryStatement += ", `PRICE`=?";
                }
                final_parameters.push(parameters[3]);
            }
            /*if (parameters[4]!=null) {
                if(queryStatement=="") {
                    queryStatement = "`STATUS`=?";
                } else {
                    queryStatement += ", `STATUS`=?";
                }
            }*/
            queryStatement += ", `UPDATED_BY`=?";
            final_parameters.push(parameters[4]);
            final_parameters.push(parameters[5]);
            queryStatement = "UPDATE `items` SET "+queryStatement+" WHERE `ITEM_ID`=?";
            console.log("queryStatement: ",queryStatement);
            //return await sequelize.query('UPDATE `items` SET `NAME`=?, `SHORT_DESC`=?, `PHOTO_URL`=?, `PRICE`=?, `STATUS`=?, `UPDATED_BY`=? WHERE `ITEM_ID`=?',    
            return await sequelize.query(queryStatement,        
                //{ replacements: parameters, type: sequelize.QueryTypes.UPDATE }
                { replacements: final_parameters, raw: true }
            )
        }

        if(type == 'setItemAsDeleted') {
            return await sequelize.query('UPDATE items SET STATUS="DELETED", UPDATED_BY=? WHERE ITEM_ID=?',
                { replacements: parameters, raw: true }
            )
        }

        if(type == 'changeOrderState') {
            return await sequelize.query('UPDATE orders SET STATE=?, LAST_STATE_CHANGE_BY=? WHERE ORDER_ID=?',
                { replacements: parameters, raw: true }
            )
        }
}

async function delete_bbdd (type, parameters) {
    console.log("##f()## mysql_connector -> delete_bbdd ");

        if (type == 'deleteItemInFav') {            
            return await sequelize.query('DELETE FROM `favorites`  WHERE `ITEM_ID`=?',
                //{ replacements: parameters, type: sequelize.QueryTypes.DELETE }
                { replacements: parameters, raw: true }
            )
        }

        if (type == 'unsetFavorite') {
            return await sequelize.query('DELETE FROM `favorites`  WHERE `USERNAME`=? AND `ITEM_ID`=?',
                //{ replacements: parameters, type: sequelize.QueryTypes.DELETE }
                { replacements: parameters, raw: true }
            )
        }

        if (type == 'deleteOrderItems') {
            return await sequelize.query('DELETE FROM `order_items` WHERE `ORDER_ID`=?',
                //{ replacements: parameters, type: sequelize.QueryTypes.DELETE }
                { replacements: parameters, raw: true }
            )
        }

        if (type == 'deleteOrder') {
            return await sequelize.query('DELETE FROM `orders` WHERE `ORDER_ID`=?',
                //{ replacements: parameters, type: sequelize.QueryTypes.DELETE }
                { replacements: parameters, raw: true }
            )
        }
}

module.exports = { insert_bbdd, select_bbdd, update_bbdd, delete_bbdd };
