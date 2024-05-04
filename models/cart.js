const {DataTypes} = require('sequelize')

const sequelize = require('../config/dbConnection')

const cart = sequelize.define('Cart',{
    totalPrice : {
        type : DataTypes.DOUBLE.UNSIGNED,
        allowNull : false
    }
},{
    timestamps : false,
})

module.exports = cart
