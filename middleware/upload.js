const multer = require('multer')

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png'
        || file.mimetype === 'image/jpeg') {
        cb(null, true)
    }
    else {
        req.fileType = '(PNG OR JPG OR JPEG) Images Only!'
        cb(null, false, req.fileType)
    }
}

const storage = multer.memoryStorage()

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 52428800 } // max file size = 50 mb
}).single('image')
