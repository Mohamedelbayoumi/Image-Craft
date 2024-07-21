const { rateLimit } = require("express-rate-limit")

// to prevent the DOS attack
const resetPasswordAndSignupLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 1,
    message: "Too many requests, please try again after a minute"
})

// to prevent the brut force attack
const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,
    message: "Too many requests, please try again after a minute"
})

// to prevent the DOS attack
const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 180,
    message: "Too many requests, please try again after a minute"
})

module.exports = {
    rateLimiter,
    resetPasswordAndSignupLimiter,
    loginLimiter
}