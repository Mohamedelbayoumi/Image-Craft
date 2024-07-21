const jwt = require('jsonwebtoken')


const likedImages = require('../models/liked.images')



const checkTheLikedImage = async (image, userId) => {
    const result = await likedImages.findOne({
        where: {
            UserId: userId,
            ImageId: image.id
        }
    })
    if (result) {
        image.isLiked = true
    }
    else {
        image.isLiked = false
    }
    return image
}


const filterImages = async (req, images) => {


    const authHeaders = req.headers.authorization || req.headers.Authorization

    if (!authHeaders) {
        return images
    }

    const accessToken = authHeaders.split(' ')[1]

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY)

    if (!decodedToken) {
        return res.status(401).json({ error: 'Invalid Token' })
    }

    const userId = decodedToken.userId

    if (images instanceof Array) {
        for (const image of images) {
            await checkTheLikedImage(image, userId)
        }
        return images
    }
    else {
        const image = await checkTheLikedImage(images, userId)
        return image
    }

}



module.exports = filterImages