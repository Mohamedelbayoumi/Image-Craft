const router = require('express').Router()

const { validateUserLogin, validateUserRegister, validateNewPassword } = require('../middleware/validator')

const { rateLimiter, resetPasswordAndSignupLimiter, loginLimiter } = require("../config/rateLimit")

const {
    generateAccessToken,
    registerUser,
    loginUser,
    forgetPassword,
    verifyOtp,
    createNewPassword,
    logoutUser,
    authWithGoogle
} = require('../controllers/auth')

router.get('/newToken', rateLimiter, generateAccessToken)

router.get('/google-authentication', rateLimiter, authWithGoogle)

router.post('/signup', resetPasswordAndSignupLimiter, validateUserRegister, registerUser)

router.post('/login/:device', loginLimiter, validateUserLogin, loginUser)

router.post('/passwordReset', resetPasswordAndSignupLimiter, forgetPassword)

router.post('/otp-verification', rateLimiter, verifyOtp)

router.patch('/new-password', rateLimiter, validateNewPassword, createNewPassword)  // add validator to check equality of password and confirm password and also many things

router.post("/logout", rateLimiter, logoutUser)

module.exports = router