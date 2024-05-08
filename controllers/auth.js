require('express-async-errors')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const qs = require('querystring')
const axios = require('axios').default

const User = require('../models/user')
const Otp = require('../models/otp')
const { authenticate } = require('../util/authentication')
const generateAuthUrl = require('../util/authUrl')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohamedbayoumi822@gmail.com',
        pass: process.env.GMAIL_SMTP_SERVICE_PASSWORD
    }
})


async function registerUser(req, res) {
    const { userName, phoneNumber, email, password } = req.body

    const user = await User.findOne({
        where: {
            email: email
        }
    })

    if (user) {
        return res.status(403).json({ message: 'Email already exists' })
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


async function loginUser(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    if (!user) {
        return res.status(404).json({ error: 'Invalid Email or Password' })
    }
    const result = await bcrypt.compare(password, user.password)

    if (result === false) {
        return res.status(401).json({ error: 'Invalid Email or Password' })
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
        authenticate(res, '30 days', userData)
    }

}


function generateAccessToken(req, res) {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(404).json({ error: "No Token Found In The Cookies" })
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

    if (!decodedToken) {
        return res.status(401).json({ error: 'Invalid Token' })
    }

    const accessToken = jwt.sign({ userId: decodedToken.userId },
        process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' })

    res.status(200).json({ accessToken })
}

async function forgetPassword(req, res) {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })

    if (!user) {
        return res.status(404).json({ error: "User Not Found" })
    }

    const otp = Math.floor(Math.random() * 1000000).toString()

    await transporter.sendMail({
        from: 'mohamedbayoumi822@gmail.com',
        to: req.body.email,
        subject: "Password Reset",
        html: `<h1>Hi there</h1>
        <p>Looks like a requset made to reset the
        password for your ${user.username} image craft account.
        No Problem! You can use the code below to reset your password</p>
        <p>The Code is ${otp}</p>`
    })

    res.status(200).json({ message: "Email Sent Successfully", userId: user.id })

    const hashedOtp = await bcrypt.hash(otp, 10)

    Otp.create({
        value: hashedOtp,
        expirationDate: Date.now() + 1800000, // 30 min
        UserId: user.id
    })

}

async function verifyOtp(req, res) {

    const code = req.body.otp
    const id = req.query.userId

    const otp = await Otp.findOne({
        where: {
            UserId: id
        }
    })

    if (!otp) {
        return res.status(404).json({ error: "No Otp Found For That User" })
    }

    const result = await bcrypt.compare(code, otp.value)

    if (result === false) {

        if (otp.expirationDate < Date.now() || otp.noOfTries > 3) {

            await otp.destroy()

            return res.status(401).json({ error: "Otp becomes invalid, please try again to reset password" })

        }

        res.status(401).json({ error: "Otp is incorrect" })

        return await otp.update({
            noOfTries: otp.noOfTries + 1
        })

    }

    res.status(200).json({ message: "Otp is valid", userId: id })

    otp.update({
        verification: true
    })
}

async function createNewPassword(req, res) {

    const userId = req.query.userId
    const { password } = req.body

    console.log(userId)

    const otp = await Otp.findOne({
        where: {
            UserId: userId
        },
        attributes: ['value', 'verification']
    })

    if (otp.verification == false) {
        return res.status(403).json({ message: "Invalid request. User has to repeat reset psssword process again" })
    }

    await otp.destroy()

    const user = await User.findByPk(userId, {
        attributes: ['id']
    })

    if (!user) {
        return res.status(404).json({ error: "User is not found" })
    }

    const hashedPassword = bcrypt.hashSync(password, 12)

    await user.update({
        password: hashedPassword
    })

    res.status(200).json({ message: "Password Updated. Redirect User To login" })
}

async function google(req, res) {
    // لازم تغير في موقع بتاع الديفلوبر ال
    // url that request comes from
    // url that will redirect to
}

async function registerWithGoogle(req, res) {
    const authUrl = generateAuthUrl('consent')
    res.status(200).json({ authUrl: authUrl })
}

async function loginWithGoogle(req, res) {
    const authUrl = generateAuthUrl('select_account')
    res.status(200).json({ authUrl: authUrl })
}

async function getGoogleUserId(req, res) {
    const code = req.query.code
    const options = {
        code: code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code"
    }

    const requset = axios.post(`https://oauth2.googleapis.com/token?${qs.stringify(options)}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    const tokens = (await requset).data
    const idToken = tokens.id_token.split('.')
    const decodedIdToken = JSON.parse(atob(idToken[1]))
    const { sub, email } = decodedIdToken

    // const user = await User.create({
    //     email : email,
    //     googleId : sub
    // })

    const user = await User.findOrCreate({
        where: {
            googleId: sub
        },
        attributes: ['id'],
        defaults: {
            email: email,
            googleId: sub
        }
    })

    if (req.params.device == 'web') {
        authenticate(res, user.id, '2 days')
    }
    else {
        authenticate(res, user.id, null)
    }
}

async function completeUserData(req, res) {
    // const userId = req.userId
    const userId = 1

    const { username, phoneNumber } = req.body

    const user = await User.update({
        username,
        phoneNumber
    }, {
        where: {
            id: userId
        }
    })

    res.status(200).json({ message: "User Data Updated Successfuly" })
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
    completeUserData,
    logoutUser
}