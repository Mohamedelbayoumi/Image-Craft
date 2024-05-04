const multer = require('multer')
const path = require('path')


const fileName = function(req, file, cb) {
    const imageName = req.body.imageName || file.originalname
    cb(null, imageName.replace(/ /g, '-') + '-' + Date.now() + path.extname(file.originalname))
}


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png'
     || file.mimetype === 'image/jpeg') {
        cb(null,true)
     }
     else {
        cb('Error: Images Only!',false)
     }
}

function passTheImage(destination) {


const storage = multer.diskStorage({
    destination : destination,
    filename : fileName  
})


return multer({storage : storage, fileFilter : fileFilter}).single('image')

}

module.exports = passTheImage
