<<<<<<< HEAD
const router = require('express').Router()

const { makePaymentIntent, createOrder } = require('../controllers/checkout')

const checkAuthentication = require('../middleware/isAuth')

router.post('/payment-intent', checkAuthentication, makePaymentIntent)

router.post('/order', checkAuthentication, createOrder)


=======
const router = require('express').Router()

const { makePaymentIntent, createOrder } = require('../controllers/checkout')

const checkAuthentication = require('../middleware/isAuth')

router.post('/payment-intent', checkAuthentication, makePaymentIntent)

router.post('/order', checkAuthentication, createOrder)


>>>>>>> e19f162825c86d9fb4c0cf3e960eca79198a4ab4
module.exports = router