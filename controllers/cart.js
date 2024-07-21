<<<<<<< HEAD

const Image = require('../models/image')
const Cart = require('../models/cart')
const ApiError = require('../util/customError')


async function addToCart(req, res, next) {

    const userId = req.userId

    const { imageId, imagePrice } = req.body

    let cart = await Cart.findOne({
        where: {
            UserId: userId
        },
        attributes: ['id', 'totalPrice']
    })

    if (!cart) {
        cart = await Cart.create({
            UserId: userId,
            totalPrice: +imagePrice
        })
    }

    else {

        if (await cart.hasImage(imageId)) {
            return next(new ApiError("Image Already Exits In The Cart", 403))
        }

        const totalPrice = cart.totalPrice + +imagePrice
        await cart.update({
            totalPrice
        })

    }

    await cart.addImage(imageId)

    res.status(201).json({ message: "Image Added To Cart" })
}

async function getCartImages(req, res, next) {

    const userId = req.userId

    const cartImages = await Cart.findOne({
        where: {
            UserId: userId
        },
        attributes: {
            exclude: ['UserId']
        },
        include: {
            model: Image,
            attributes: ['id', 'price', 'imageName', 'imagePath'],
            through: {
                attributes: []
            }
        }
    })

    if (!cartImages) {
        return next(new ApiError("No Cart Found", 404))
    }

    res.status(200).json({
        totalPrice: cartImages.totalPrice,
        images: cartImages.Images,
    })
}

async function deleteImageFromCart(req, res, next) {

    const userId = req.userId

    const imageId = req.params.imageId

    const imagePrice = req.body.imagePrice

    const cart = await Cart.findOne({
        where: {
            UserId: userId
        },
        attributes: {
            exclude: ['UserId']
        }
    })

    if (!cart) {
        return next(new ApiError("No Cart Found", 404))
    }

    const totalPrice = cart.totalPrice - imagePrice

    await cart.update({
        totalPrice
    })

    await cart.removeImage(imageId)

    res.status(200).json({ message: "Image Removed From Cart" })
}

async function deleteCart(req, res) {

    const userId = req.userId

    await Cart.destroy({
        where: {
            UserId: userId
        }
    })

    res.status(200).json({ message: "Cart Deleted Successfully" })
}

module.exports = {
    addToCart,
    getCartImages,
    deleteImageFromCart,
    deleteCart
=======
require('express-async-errors')

const Image = require('../models/image')
const Cart = require('../models/cart')


async function addToCart(req, res) {

    const userId = req.userId

    const { imageId, imagePrice } = req.body

    let cart = await Cart.findOne({
        where: {
            UserId: userId
        },
        attributes: ['id', 'totalPrice']
    })

    if (!cart) {
        cart = await Cart.create({
            UserId: userId,
            totalPrice: +imagePrice
        })
    }

    else {

        if (await cart.hasImage(imageId)) {
            return res.status(403).json({ error: "Image Already Exits In The Cart" })
        }

        const totalPrice = cart.totalPrice + +imagePrice
        await cart.update({
            totalPrice
        })

    }

    await cart.addImage(imageId)

    res.status(201).json({ message: "Image Added To Cart" })
}

async function getCartImages(req, res) {

    const userId = req.userId

    const cartImages = await Cart.findOne({
        where: {
            UserId: userId
        },
        attributes: {
            exclude: ['UserId']
        },
        include: {
            model: Image,
            attributes: ['id', 'price', 'imageName', 'imagePath'],
            through: {
                attributes: []
            }
        }
    })

    if (!cartImages) {
        return res.status(404).json({ message: "No Cart Found" })
    }

    res.status(200).json({
        totalPrice: cartImages.totalPrice,
        images: cartImages.Images,
    })
}

async function deleteImageFromCart(req, res) {

    const userId = req.userId

    const imageId = req.params.imageId

    const imagePrice = req.body.imagePrice

    const cart = await Cart.findOne({
        where: {
            UserId: userId
        },
        attributes: {
            exclude: ['UserId']
        }
    })

    if (!cart) {
        return res.status(404).json({ error: "No Cart Found" })
    }

    const totalPrice = cart.totalPrice - imagePrice

    await cart.update({
        totalPrice
    })

    await cart.removeImage(imageId)

    res.status(200).json({ message: "Image Removed From Cart" })
}

async function deleteCart(req, res) {

    const userId = req.userId

    await Cart.destroy({
        where: {
            UserId: userId
        }
    })

    res.status(200).json({ message: "Cart Deleted Successfully" })
}

module.exports = {
    addToCart,
    getCartImages,
    deleteImageFromCart,
    deleteCart
>>>>>>> e19f162825c86d9fb4c0cf3e960eca79198a4ab4
}