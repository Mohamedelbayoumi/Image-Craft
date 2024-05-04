const Image = require('../models/image')
const Cart = require('../models/cart')
const cartImages = require('../models/cart.images')
const User = require('../models/user')
const Caterogy = require('../models/caterogy')
const Order = require('../models/order')
const orderImage = require('../models/order.images')
const likedImages = require('../models/liked.images')
const Otp = require('../models/otp')
const Card = require('../models/card')
const paymentIntent = require('../models/paymentIntent')


function setRelationships() {

    Cart.belongsToMany(Image, {through : cartImages, onDelete: 'CASCADE'})
    Image.belongsToMany(Cart, {through : cartImages})
    
    User.hasMany(Image, {onDelete: 'CASCADE'})
    Image.belongsTo(User)
    
    Caterogy.hasMany(Image)
    Image.belongsTo(Caterogy)
    
    User.hasOne(Cart, { onDelete: 'CASCADE'}) // userId in cart table
    Cart.belongsTo(User)

    User.hasMany(Order, {onDelete : 'CASCADE'})
    Order.belongsTo(User)

    Order.belongsToMany(Image, {through : orderImage, onDelete: 'CASCADE'})
    Image.belongsToMany(Order, {through : orderImage})

    User.belongsToMany(Image, {through : likedImages , onDelete : 'CASCADE'})
    Image.belongsToMany(User, {through : likedImages })

    User.hasOne(Otp, {onDelete: 'CASCADE'})
    Otp.belongsTo(User)

    User.hasOne(Card, { onDelete: 'CASCADE'})
    Card.belongsTo(User)

    User.hasOne(paymentIntent, { onDelete: 'CASCADE'})
    paymentIntent.belongsTo(User)
}


module.exports = setRelationships

