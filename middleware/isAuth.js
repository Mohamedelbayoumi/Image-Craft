const jwt = require('jsonwebtoken')

const ApiError = require('../util/customError')


const checkAuthentication = (req, res, next) => {

    const authHeaders = req.headers.authorization || req.headers.Authorization

    if (!authHeaders) {
        return next(new ApiError('No Token Found', 404))
    }

    const accessToken = authHeaders.split(' ')[1]

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY)

    if (!decodedToken) {
        return next(new ApiError('Invalid Token', 401))
    }

    req.userId = decodedToken.userId

    next()
}

module.exports = checkAuthentication