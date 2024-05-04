const {DataTypes} = require('sequelize')

const sequelize = require('../config/dbConnection')

const Card = sequelize.define('card',{
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    number : {
        type :DataTypes.BIGINT.UNSIGNED,
        allowNull : false,
        unique : true
    },
    expiryDate : {
        type : DataTypes.STRING,
        allowNull : false
    },
    securityCode :{
        type : DataTypes.INTEGER.UNSIGNED,
        allowNull : false
    },
    postalCode : {
        type : DataTypes.INTEGER.UNSIGNED,
        allowNull : false
    }
},{
    timestamps : false
})



module.exports = Card