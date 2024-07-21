const { DataTypes } = require('sequelize')

const sequelize = require('../config/dbConnection')


const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    googleId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    imageProfilePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imageKitId: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
})


module.exports = User