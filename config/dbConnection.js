const { Sequelize } = require('sequelize')
require("dotenv").config()

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASW_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'mysql',
    define: {
        freezeTableName: true
    },
    dialectOptions: {
        connectTimeout: 15000
    }
})


module.exports = sequelize