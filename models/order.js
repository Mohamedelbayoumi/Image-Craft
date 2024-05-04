const sequelize = require('../config/dbConnection')

const Order = sequelize.define('Order',{},{
    createdAt : true,
    updatedAt : false
})


module.exports = Order