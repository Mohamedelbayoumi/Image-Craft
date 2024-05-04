const router = require('express').Router()

const {makePaymentIntent, getCardData, saveCardData, createOrder} = require('../controllers/checkout')

const checkAuthentication = require('../middleware/isAuth')

router.get('/checkout', checkAuthentication, getCardData)

router.post('/payment-intent', checkAuthentication, makePaymentIntent)

router.post('/order', checkAuthentication, createOrder)

router.put('/checkout', checkAuthentication, saveCardData)

module.exports = router