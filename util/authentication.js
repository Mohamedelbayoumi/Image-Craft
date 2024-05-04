"use strict"; // will throw error if variable is used without declaration
// ex : x = 10  -> error

const User = require('../models/user')
const jwt = require('jsonwebtoken')

async function authenticate(res, userId, expirationDate) {

const accessToken = jwt.sign({userId},
                    process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn : '15m'})

const refreshToken = jwt.sign({userId},
    process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn : expirationDate})

res.cookie('refreshToken',refreshToken,{
    path : "/api/v1/newToken",
    httpOnly: true,
    sameSite: 'strict'
})

res.status(200).json({message : 'login successfully', accessToken})

}

module.exports = {
    authenticate
}

// // logout 
// res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
//     res.sendStatus(204);