const router = require('express').Router()

const {
    getImages,
    uploadImage,
    getSingleImage,
    getCaterogyImages,
    getImagesByName,
    getImagesByPrice,
    deleteUploadedImage,
    searchByImage,
    downloadImage
} = require('../controllers/image')

const passTheImage = require('../middleware/upload')
const { validateImage } = require('../middleware/validator')
const checkAuthentication = require('../middleware/isAuth')
const checkDownload = require('../middleware/downloadCheck')


router.get('/images', getImages)

router.post('/images', checkAuthentication, passTheImage, validateImage, uploadImage)

router.post("/searching-by-image", passTheImage, searchByImage)

router.get('/images/search', getImagesByName)

router.get("/images/search/price", getImagesByPrice)

router.get('/image', getSingleImage)

router.get('/images/caterogy/:caterogy', getCaterogyImages)

router.delete("/image", checkAuthentication, deleteUploadedImage)

router.get("/image-downloading/:imageId", checkAuthentication, checkDownload, downloadImage)




module.exports = router