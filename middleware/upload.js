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

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single('image')
