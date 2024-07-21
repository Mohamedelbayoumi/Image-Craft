
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const qs = require('querystring')
const axios = require('axios').default
const { Op } = require("sequelize");

const User = require('../models/user')

const ApiError = require('../util/customError')
const { authenticate } = require('../util/authentication')

const redisClient = require('../config/redisConnection')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohamedbayoumi822@gmail.com',
        pass: process.env.GMAIL_SMTP_SERVICE_PASSWORD
    }
})


async function registerUser(req, res, next) {
    const { userName, phoneNumber, email, password } = req.body

    const user = await User.findOne({
        where: {
            [Op.or]: [
                { email: email },
                { userName: userName },
                { phoneNumber: phoneNumber }
            ]
        }
    })

    if (user) {
        // 409 -> the request was unable to be completed due to a conflict with the current state of the resource.

        if (user.email === email) {
            return next(new ApiError('Email already exists'), 409)
        }

        else if (user.username === userName) {
            return next(new ApiError("The name is already used", 409))
        }

        else if (user.phoneNumber === phoneNumber) {
            return next("The phone number is already existed", 409)
        }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await User.create({
        username: userName,
        email: email,
        phoneNumber: phoneNumber,
        password: hashedPassword
    })

    res.status(201).json({ message: 'Registered Successfully' })

}

async function loginUser(req, res, next) {

    const { email, password } = req.body

    const user = await User.findOne({
        where: {
            email: email
        }
    })

    if (!user) {
        return next(new ApiError('No email for this user', 404))
    }

    if (user.password == null && user.googleId) {
        return next(new ApiError('User registered with google OAuth. Please log in using Google.', 401))
    }

    const result = await bcrypt.compare(password, user.password)

    if (result === false) {
        return next(new ApiError('Password is incorrect', 401))
    }

    const userData = {
        userId: user.id,
        userName: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
    }

    if (req.params.device == 'web') {
        authenticate(res, '2 days', userData)
    }
    else {
        authenticate(res, null, userData)
    }

}

function generateAccessToken(req, res, next) {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return next(new ApiError("No Token Found In The Cookies", 404))
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

    if (!decodedToken) {
        return next(new ApiError("Invalid Token", 401))
    }

    const accessToken = jwt.sign({ userId: decodedToken.userId },
        process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' })

    res.status(200).json({ accessToken })
}

async function forgetPassword(req, res, next) {

    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })

    if (!user) {
        return next(new ApiError("User Not Found", 404))
    }

    if (user.password == null && user.googleId) {
        return next(new ApiError('User registered with google OAuth. so there is no password to change.', 403))
    }

    const otp = Math.floor(Math.random() * 1000000).toString()

    await transporter.sendMail({
        from: 'mohamedbayoumi822@gmail.com',
        to: req.body.email,
        subject: "Password Reset",
        html: `<h1>Hi there</h1>
        <p>Looks like a requset made to reset the
        password for your ${user.username} image craft account. 
        No Problem! You can use the code below to reset your password. 
        Please note that this OTP is valid for 30 minutes from the time this email was sent. 
        You have a maximum of 3 attempts to enter the OTP correctly. 
        After 3 unsuccessful attempts, the OTP will be invalid. 
        Kindly ensure you enter the OTP carefully.</p>
        <p>The Code is ${otp}</p>`
    })

    res.status(200).json({ message: "Email Sent Successfully", userId: user.id })

    const hashedOtp = await bcrypt.hash(otp, 8)

    const ttl = 1200 // expire after 20 min

    await redisClient.setEx(`otp ${user.id}`, ttl, hashedOtp)
    await redisClient.setEx(`otp ${user.id} tries`, ttl, 3)
}

async function verifyOtp(req, res, next) {

    const code = req.body.otp
    const id = req.query.userId

    const otp = await redisClient.get(`otp ${id}`)

    if (!otp) {
        return next(new ApiError(" Otp is invalid, please try again to reset password", 401))
    }

    const result = await bcrypt.compare(code, otp)

    if (result === false) {

        const noOfTries = Number(await redisClient.get(`otp ${id} tries`))

        if (noOfTries == 0) {

            await redisClient.del(`otp ${id}`)

            return new ApiError("Otp becomes invalid, please try again to reset password", 401)
        }

        next(new ApiError("Otp is incorrect", 401))

        const ttl = await redisClient.ttl(`otp ${id} tries`)

        return await redisClient.setEx(`otp ${id} tries`, ttl, `${noOfTries--}`)

    }

    res.status(200).json({ message: "Otp is valid", userId: id })

    await redisClient.del(`otp ${id} tries`)
    await redisClient.del(`otp ${id}`)
}

async function createNewPassword(req, res, next) {

    const userId = req.query.userId
    const { password } = req.body

    const user = await User.findByPk(userId, {
        attributes: ['id']
    })

    if (!user) {
        return next(new ApiError("User is not found", 404))
    }

    const hashedPassword = bcrypt.hashSync(password, 12)

    await user.update({
        password: hashedPassword
    })

    res.status(200).json({ message: "Password Updated. Redirect User To login" })
}

async function authWithGoogle(req, res, next) {

    const code = req.query.code

    if (!code) {
        return next(new ApiError('there is no code to send to google apis', 404))
    }

    const options = {
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code"
    }

    const response = await axios.post(`https://oauth2.googleapis.com/token?${qs.stringify(options)}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    const tokens = response.data
    const idToken = tokens.id_token.split('.')
    const decodedIdToken = JSON.parse(atob(idToken[1]))
    const { sub, email } = decodedIdToken

    const user = await User.findOrCreate({
        where: {
            googleId: sub
        },
        attributes: ['id'],
        defaults: {
            email: email,
            googleId: sub,
            userName: email.split('@')[0]
        }
    })

    authenticate(res, user.id, '2 days')

}

async function logoutUser(req, res) {

    res.clearCookie("refreshToken", {
        path: "/api/v1/newToken",
        httpOnly: true,
        sameSite: 'strict'
    })

    res.status(200).json({ message: "Refresh Token Deleted Successfully" })
}


module.exports = {
    registerUser,
    loginUser,
    generateAccessToken,
    forgetPassword,
    verifyOtp,
    createNewPassword,
    logoutUser,
    authWithGoogle
}