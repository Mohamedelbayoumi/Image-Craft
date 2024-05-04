const router = require('express').Router()

const {validateUserLogin, validateUserRegister, validateNewPassword} = require('../middleware/validator')

const checkAuthentication = require('../middleware/isAuth')

const {
    generateAccessToken,
    registerUser,
    loginUser,
    forgetPassword,
    verifyOtp,
    createNewPassword,
    completeUserData,
    logoutUser
} = require('../controllers/auth')

router.get('/newToken', generateAccessToken)

router.get('/registerwithgoogle')

router.patch('/user-data-completion', checkAuthentication, completeUserData)

router.get('/loginwithgoogle') // suggestion n7ot google in query string

router.post('/oAuth/:device')

router.post('/signup', validateUserRegister, registerUser)

router.post('/login/:device',validateUserLogin, loginUser)

router.post('/passwordReset', forgetPassword)

router.post('/otp-verification/', verifyOtp)

router.patch('/new-password', validateNewPassword, createNewPassword)  // add validator to check equality of password and confirm password and also many things

router.post("/logout",  logoutUser)

module.exports = router