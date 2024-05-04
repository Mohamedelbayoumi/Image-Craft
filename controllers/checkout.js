const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY)

const PaymentIntent = require('../models/paymentIntent')
const Card = require('../models/card')
const Order = require('../models/order')
const Cart = require('../models/cart')
const Image = require('../models/image')

async function makePaymentIntent(req, res) {

    const userId = req.userId

    const totalPrice = req.body.totalPrice

    // let pI = await PaymentIntent.findOne({
    //     where : {
    //         UserId : userId
    //     }
    // })

    // if (!pI) {
    //     const customer = await stripe.customers.create()
    //     const ephemeralKey = await stripe.ephemeralKeys.create(
    //     {customer : customer.id},
    //     {apiVersion: '2024-04-10'}
    //     )

    //     pI = await PaymentIntent.create({
    //         customerId : customer.id,
    //         ephemeralKeySecret : ephemeralKey.secret
    //     })
    // }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice * 100,
        currency: 'usd',
        payment_method_types: ['card']
    })

    // res.status(200).json({
    //     clientSecret : paymentIntent.client_secret,
    //     ephemeralKey : pI.ephemeralKeySecret,
    //     customer : pI.customerId,
    //     publishableKey : process.env.STRIPE_TEST_PUBLISHABLE_KEY
    // })

    const card = getCardData(req, res)

    res.status(201).json({ clientSecret: paymentIntent.client_secret, cardData: card })

}

async function saveCardData(req, res) {
    const userId = req.userId

    const { name, number, expiryDate, securityCode, postalCode } = req.body.card

    const [card, created] = await Card.findOrCreate({
        where: {
            UserId: userId
        },
        defaults: {
            name,
            number,
            expiryDate,
            securityCode,
            postalCode
        }
    })

    if (!created) {
        await card.update({
            name,
            number,
            expiryDate,
            securityCode,
            postalCode
        })
    }

    res.status(200).json({ message: "Card Data Saved Successfully" })
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

async function getCardData(req, res) {

    const userId = req.userId

    const card = await Card.findOne({
        where: {
            UserId: userId
        },
        attributes: {
            exclude: ['id', 'UserId']
        }
    })

    if (!card) {
        return res.status(404).json({ message: "Card Data Not Found" })
    }

    return card
}

module.exports = {
    makePaymentIntent,
    saveCardData,
    getCardData,
    createOrder
}