const multer = require('multer')

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png'
        || file.mimetype === 'image/jpeg') {
        cb(null, true)
    }
    else {
        cb('Error: Images Only!', false)
    }
}

const storage = multer.memoryStorage()

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single('image')
