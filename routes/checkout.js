const router = require('express').Router()

const { makePaymentIntent, createOrder } = require('../controllers/checkout')

const checkAuthentication = require('../middleware/isAuth')

router.post('/payment-intent', checkAuthentication, makePaymentIntent)

router.post('/order', checkAuthentication, createOrder)


module.exports = router