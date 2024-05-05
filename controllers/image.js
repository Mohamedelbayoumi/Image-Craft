const sizeOf = require("image-size");
const { Op } = require("sequelize");
const { unlink } = require("fs")

const Image = require("../models/image");
const Caterogy = require("../models/caterogy");
const User = require("../models/user");

async function getImages(req, res) {
  const page = +req.query.page || 1;

  const images = await Image.findAll({
    attributes: ["id", "imageName", "price", "imagePath"],
    limit: 2,
    offset: (page - 1) * 2, // skip images
  });

  if (!images) {
    return res.status(404).json({ error: "No Images Found" });
  }
  res.status(200).json(images);
}

async function uploadImage(req, res) {
  const userId = req.userId;

  const { caterogy, imageName, price, description, location } = req.body;

  const imageCaterogy = await Caterogy.findOne({
    where: {
      caterogyName: caterogy,
    },
    attributes: ["id"],
  });

  await imageCaterogy.createImage({
    imageName,
    price,
    description,
    location,
    imagePath: req.file.path,
    UserId: userId,
  });

  res.status(201).json({ message: "Image Uploaded Successfully" });
}

async function getSingleImage(req, res, next) {

  const id = req.query.imageId;

  const image = await Image.findByPk(id, {
    attributes: {
      exclude: ["CaterogyId"],
    },
    include: {
      model: Caterogy,
      attributes: ["caterogyName"],
    },
  });

  if (!image) {
    return res.status(404).json({ error: "Image Not Found" });
  }

  const dimensions = sizeOf(image.imagePath);

  const user = await User.findByPk(image.UserId, {
    attributes: ["username", "imageProfilePath"]
  })

  const imageDetails = {
    height: dimensions.height,
    width: dimensions.width,
    type: dimensions.type,
    uploadDate: image.createdAt,
    location: image.location,
    caterogy: image.Caterogy.caterogyName,
  };

  const imageData = {
    name: image.imageName,
    price: image.price,
    path: image.imagePath,
    description: image.description,
    noOfLikes: image.noOfLikes
  };

  const userData = {
    username: user.username,
    profileImage: user.imageProfilePath
  }

  res.status(200).json({ imageDetails, imageData, userData });
}

async function getCaterogyImages(req, res) {
  const caterogyName = req.params.caterogy;

  const page = +req.query.page || 1;

  // const caterogy = await Caterogy.findOne({
  //     where : {
  //         caterogyName
  //     },
  //     attributes : {
  //         exclude : ["id", "caterogyName"]
  //     },
  //     include : {
  //         model : Image,
  //         required : true,
  //         attributes : ["id", "imageName","price","imagePath"]
  //     }
  // })

  const caterogy = await Caterogy.findOne({
    where: {
      caterogyName,
    },
    attributes: ["id"],
  });

  if (!caterogy) {
    res.status(404).json({ error: "No Caterogy By This Name Found" });
  }

  const images = await Image.findAll({
    where: {
      CaterogyId: caterogy.id,
    },
    attributes: ["id", "imageName", "price", "imagePath"],
    limit: 2,
    offset: (page - 1) * 2,
  });

  if (!images) {
    return res.status(404).json({ error: "No Images Found" });
  }

  res.status(200).json(images);
}

async function getImagesByName(req, res) {
  const imageName = req.query.imageName;

  const images = await Image.findAll({
    where: {
      imageName: {
        [Op.substring]: imageName,
      },
    },
    attributes: ["id", "imageName", "price", "imagePath"],
  });

  if (!images) {
    return res.status(404).json({ message: "No Images Found" });
  }

  res.status(200).json(images);
}

async function getImagesByPrice(req, res) {
  const order = req.query.order;

  const page = +req.query.page || 1;

  const images = await Image.findAll({
    order: [["price", order]],
    attributes: ["id", "imageName", "price", "imagePath"],
    offset: (page - 1) * 2,
    limit: 2,
  });

  if (!images) {
    return res.status(404).json({ message: "No Images Found" });
  }

  res.status(200).json(images);
}

async function deleteUploadedImage(req, res, next) {

  const imageId = req.query.imageId

  const image = await Image.findByPk(imageId, {
    attributes: ["id", "imagePath"]
  })

  if (!image) {
    return res.status(404).json({ Messge: "Image Not Found" })
  }

  unlink(image.imagePath, (err) => {
    if (err) {
      return next(err)
    }
  })

  await image.destroy()

  res.status(200).json({ Messge: "Image Deleted Successfully" })
}

module.exports = {
  getImages,
  uploadImage,
  getSingleImage,
  getCaterogyImages,
  getImagesByName,
  getImagesByPrice,
  deleteUploadedImage
};