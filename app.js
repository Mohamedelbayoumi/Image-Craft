require('dotenv').config()
require('./config/relationships')()
require("express-async-errors")

const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const sequelize = require('./config/dbConnection')

const ApiError = require('./util/customError')

const { rateLimiter } = require("./config/rateLimit")
const compression = require("./config/compression")

const imageRoutes = require('./routes/image')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const cartRoutes = require('./routes/cart')
const checkoutRoutes = require('./routes/checkout')


const app = express()

const port = process.env.PORT || 5000

app.use(compression)
app.use(helmet())
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie")
    next()
})


app.use("/api/v1", authRoutes)
app.use("/api/v1", rateLimiter, imageRoutes)
app.use("/api/v1", rateLimiter, userRoutes)
app.use("/api/v1/cart", rateLimiter, cartRoutes)
app.use("/api/v1", rateLimiter, checkoutRoutes)

app.use((req, res, next) => {
    next(new ApiError(`Can't Find This Route : ${req.originalUrl} with http method : ${req.method}`, 404))
})


app.use((err, req, res, next) => {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    console.error(err)
    res.status(err.statusCode).json({ message: err.message })
})


if (process.env.NODE_ENV == 'production') {
    sequelize.authenticate()
        .then(() => {
            console.log("DataBase Connected")
            const server = app.listen(port, () => {
                console.log(`Server listen on port ${port}`);
            })
            server.keepAliveTimeout = 120 * 1000
            server.headersTimeout = 120 * 1000
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
} else {

    // this condition is made to make tests run correctly

    const server = app.listen(port, () => {
        console.log(`Server listen on port ${port}`);
    })

    module.exports = {
        server,
        app
    }
}



// For API connection Testing :
// const ngrok = require('@ngrok/ngrok')
// ngrok.connect({
//     addr: port,
//     authtoken_from_env: true
// })
//     .then((listener) => {
//         console.log(`Ingress established at: ${listener.url()}`)
//     })
