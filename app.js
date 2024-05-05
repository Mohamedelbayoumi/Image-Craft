require('./config/relationships')()
require('dotenv').config()
require("express-async-errors")

const express = require('express')
const cookieParser = require('cookie-parser')
const ngrok = require('@ngrok/ngrok');

const sequelize = require('./config/dbConnection')

const imageRoutes = require('./routes/image')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const cartRoutes = require('./routes/cart')
const checkoutRoutes = require('./routes/checkout')


const app = express()

const port = process.env.PORT || 5000

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static('images'))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie")
    next()
})


app.use("/api/v1", authRoutes)
app.use("/api/v1", imageRoutes)
app.use("/api/v1", userRoutes)
app.use("/api/v1/cart", cartRoutes)
app.use("/api/v1", checkoutRoutes)


app.use((err, req, res, next) => {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    console.error(err)
    res.status(err.statusCode).json({ message: err.message, err: err.name })
})


// sequelize.sync().then(() => {
//     console.log("DataBase Connected")
//     app.listen(5000, () => {
//         console.log("Server listen on port 5000");
//     })
// })


sequelize.authenticate()
    .then(() => {
        console.log("DataBase Connected")
        const server = app.listen(port, () => {
            console.log("Server listen on port 5000");
        })
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// ngrok.connect({
//     addr: 5000,
//     authtoken_from_env: true
// })
//     .then((listener) => {
//         console.log(`Ingress established at: ${listener.url()}`)
//     })
