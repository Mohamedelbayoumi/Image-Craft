const {Sequelize} = require('sequelize')

const sequelize = new Sequelize({
    database : 'image_craft',
    host : 'localhost',
    port : 3000,
    username : 'root',
    password : 'mentafi',
    dialect : 'mysql',
    define : {
        freezeTableName : true
    }
})


module.exports = sequelize