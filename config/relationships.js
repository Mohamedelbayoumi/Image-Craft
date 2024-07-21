const Image = require('../models/image')
const Cart = require('../models/cart')
const cartImages = require('../models/cart.images')
const User = require('../models/user')
const Caterogy = require('../models/caterogy')
const Order = require('../models/order')
const orderImage = require('../models/order.images')
const likedImages = require('../models/liked.images')


function setRelationships() {

    Cart.belongsToMany(Image, { through: cartImages, onDelete: 'CASCADE' })
    Image.belongsToMany(Cart, { through: cartImages })

    User.hasMany(Image, { onDelete: 'CASCADE' })
    Image.belongsTo(User)

    Caterogy.hasMany(Image, { foreignKey: 'CaterogyId' })
    Image.belongsTo(Caterogy, { foreignKey: 'CaterogyId' })

    User.hasOne(Cart, { onDelete: 'CASCADE' })
    Cart.belongsTo(User)

    User.hasMany(Order, { onDelete: 'CASCADE' })
    Order.belongsTo(User)

    Order.belongsToMany(Image, { through: orderImage, onDelete: 'CASCADE' })
    Image.belongsToMany(Order, { through: orderImage })

    User.belongsToMany(Image, { through: likedImages, onDelete: 'CASCADE' })
    Image.belongsToMany(User, { through: likedImages })

}


module.exports = setRelationships

