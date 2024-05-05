const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME || 'image_craft',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASW_PORT || 3000,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'mentafi',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
})


module.exports = sequelize