const ImageKit = require("imagekit")

const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/pdrdxybo1"
});


module.exports = imagekit