const {DataTypes} = require('sequelize')

const sequelize = require('../config/dbConnection')

const Otp = sequelize.define('Otp',{
    value : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey : true,
        unique : true
    },
    expirationDate : {
        type : DataTypes.STRING,
        allowNull : false
    },
    noOfTries : {
        type : DataTypes.TINYINT(1),
        defaultValue : 0,
    },
    verification : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    }
},{
    timestamps : false
})

module.exports = Otp