const {DataTypes} = require('sequelize')

const sequelize = require('../config/dbConnection')

const caterogy = sequelize.define('Caterogy',{
    caterogyName : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    }
},{
    timestamps : false,
})


module.exports = caterogy