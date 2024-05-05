const router = require('express').Router()

const { makePaymentIntent, saveCardData, createOrder } = require('../controllers/checkout')

const checkAuthentication = require('../middleware/isAuth')

router.post('/payment-intent', checkAuthentication, makePaymentIntent)

router.post('/order', checkAuthentication, createOrder)

router.put('/checkout', checkAuthentication, saveCardData)

module.exports = router