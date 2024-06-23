"use strict"; // will throw error if variable is used without declaration
// ex : x = 10  -> error

const jwt = require('jsonwebtoken')

async function authenticate(res, expirationDate, userData) {

    const accessToken = jwt.sign({ userId: userData.userId },
        process.env.ACCESS_TOKEN_SECRET_KEY)

    // const refreshToken = jwt.sign({userId},
    //     process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn : expirationDate})

    // res.cookie('refreshToken',refreshToken,{
    //     path : "/api/v1/newToken",
    //     httpOnly: true,
    //     sameSite: 'strict'
    // })

    res.status(200).json({ accessToken, userData })

}

module.exports = {
    authenticate
}
