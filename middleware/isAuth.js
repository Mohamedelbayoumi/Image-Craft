const jwt =  require('jsonwebtoken')
require('express-async-errors')


const checkAuthentication = (req,res,next) => {
    const authHeaders = req.headers.authorization || req.headers.Authorization
    if (!authHeaders) {
        return res.status(404).json({error : 'No Token Found'})
    }
    const accessToken = authHeaders.split(' ')[1]
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY)
        if (!decodedToken) {
            return res.status(401).json({error : 'Invalid Token'})
        }
    req.userId = decodedToken.userId    
    next()    
}

module.exports = checkAuthentication