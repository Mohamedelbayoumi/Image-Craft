const {DataTypes} = require('sequelize')

const sequelize = require('../config/dbConnection')


const User = sequelize.define('User',{    
    username : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    email : {
        type : DataTypes.STRING(30), // عدلها و شيل ال 30
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : true
    },
    phoneNumber : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    followersNum : {
        type : DataTypes.INTEGER.UNSIGNED,
        defaultValue : 0
    },
    followingNum : {
        type : DataTypes.INTEGER.UNSIGNED,
        defaultValue : 0,
    },
    googleId : {
        type : DataTypes.STRING,
        allowNull : true
    },
    imageProfilePath : {
        type : DataTypes.STRING,
        allowNull : true
    }
},{
    timestamps : false
})


module.exports = User