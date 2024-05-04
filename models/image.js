const { DataTypes } = require('sequelize')

const sequelize = require('../config/dbConnection')

const Image = sequelize.define('Image', {
    price: {
        type: DataTypes.DOUBLE.UNSIGNED,
        allowNull: false
    },
    imageName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    noOfLikes: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    }
}, {
    createdAt: true,
    updatedAt: false,
})


module.exports = Image