const router = require('express').Router()

const {
    getImages,
    uploadImage,
    getSingleImage,
    getCaterogyImages,
    getImagesByName,
    getImagesByPrice,
    deleteUploadedImage
} = require('../controllers/image')

const passTheImage = require('../middleware/upload')
const { validateImage } = require('../middleware/validator')
const checkAuthentication = require('../middleware/isAuth')

/**
 * @swagger
 * components:
 *  schemas:
 *      image:
 *            type: object
 *            required
 */

/**
 * @swagger
 * /api/v1/images:
 *  get:
 *      responses:
 *          200:
 *              description: gets all images
 *              content:
 *                  application/json
 */


router.get('/images', getImages)

router.post('/images', checkAuthentication, passTheImage, validateImage, uploadImage)

router.get('/images/search', getImagesByName)

router.get("/images/search/price", getImagesByPrice)

router.get('/image', getSingleImage)

router.get('/images/caterogy/:caterogy', getCaterogyImages)

router.delete("/image", checkAuthentication, deleteUploadedImage)

// router.get('/images/:id')



module.exports = router