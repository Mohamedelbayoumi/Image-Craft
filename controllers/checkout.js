const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY)

const Order = require('../models/order')
const Cart = require('../models/cart')
const Image = require('../models/image')

async function makePaymentIntent(req, res) {

    const totalPrice = req.body.totalPrice

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice * 100,
        currency: 'usd',
        payment_method_types: ['card']
    })

    res.status(201).json({ clientSecret: paymentIntent.client_secret })

}


async function createOrder(req, res) {

    const userId = req.userId

    const cart = await Cart.findOne({
        where: {
            UserId: userId
        },
        attributes: {
            exclude: ['UserId', 'totalPrice']
        },
        include: {
            model: Image,
            attributes: ['id'],
            through: {
                attributes: []
            },
            required: true
        }
    })

    const order = await Order.create({
        UserId: userId,
    })

    await order.addImages(cart.Images)

    res.status(201).json({ message: "Order Created Successfully" })

    await cart.destroy() // delete cart after making order
}


module.exports = {
    makePaymentIntent,
    createOrder
}