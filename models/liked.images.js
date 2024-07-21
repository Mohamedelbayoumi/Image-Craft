const sequelize = require('../config/dbConnection')

const likedImages = sequelize.define('likedImages', {}, {
    timestamps: false,
    freezeTableName: false
})

module.exports = likedImages