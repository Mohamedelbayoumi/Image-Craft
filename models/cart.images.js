const sequelize = require('../config/dbConnection')

const cartImages = sequelize.define('cartImages', {}, {
    timestamps: false,
    freezeTableName: false
})


module.exports = cartImages