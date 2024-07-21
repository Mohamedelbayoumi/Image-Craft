const Order = require('../models/order.js')

const ApiError = require('../util/customError.js')

const checkDownload = async (req, res, next) => {

    const userId = req.userId

    const order = await Order.findOne({
        where: {
            UserId: userId
        }
    })

    if (order) {
        next()
    }
    else {
        next(new ApiError("You should order this image first before dwonloading", 403))
    }
}

module.exports = checkDownload