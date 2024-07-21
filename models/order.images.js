const sequelize = require('../config/dbConnection')

const orderImage = sequelize.define('orderImage', {}, {
    timestamps: false,
    freezeTableName: false
})


module.exports = orderImage