const router = require("express").Router()

const {addToCart, getCartImages, deleteImageFromCart, deleteCart} = require('../controllers/cart')

const checkAuthentication = require('../middleware/isAuth')

router.get('/', checkAuthentication, getCartImages)

router.post('', checkAuthentication, addToCart)

router.patch('/:imageId', checkAuthentication, deleteImageFromCart)

router.delete('', checkAuthentication, deleteCart)

module.exports = router