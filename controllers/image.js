const { Op } = require("sequelize");
const axios = require('axios').default

const Image = require("../models/image");
const Caterogy = require("../models/caterogy");
const User = require("../models/user");

const imageKit = require("../config/image-kit")

const filterImages = require("../util/imageIsLiked");
const ApiError = require("../util/customError");


async function getImages(req, res, next) {

  const page = +req.query.page || 1;

  let images = await Image.findAll({
    attributes: ["id", "imageName", "price", "imagePath"],
    raw: true,
    limit: 6,
    offset: (page - 1) * 6
  });

  if (!images) {
    return next(new ApiError("No Images Found", 404))
  }

  images = await filterImages(req, images)


  res.status(200).json({ data: images });
}

async function uploadImage(req, res, next) {

  if (req.fileType) {
    // 415 -> Unsupported Media Type
    return next(new ApiError("(PNG OR JPG OR JPEG) Images Only!", 415))
  }

  const userId = req.userId;

  const { caterogy, imageName, price, description, location } = req.body;

  const imageCaterogy = await Caterogy.findByPk(caterogy)


  const response = await imageKit.upload({
    file: req.file.buffer,
    folder: "images",
    fileName: imageName
  })


  await imageCaterogy.createImage({
    imageName,
    price,
    description,
    location,
    imagePath: response.url,
    UserId: userId,
    imageKitId: response.fileId
  });

  res.status(201).json({ message: "Image Uploaded Successfully" });
}

async function getSingleImage(req, res, next) {

  const id = req.query.imageId;

  const result = await Image.increment('noOfViews', {
    where: {
      id: id
    }
  })

  if (result[0][1] == 0) {
    return next(new ApiError('No image found', 404))
  }

  const image = await Image.findByPk(id, {
    attributes: {
      exclude: ["CaterogyId"],
    },
    include: {
      model: Caterogy,
      attributes: ["caterogyName"],
    }
  });


  const response = await imageKit.getFileDetails(image.imageKitId)

  const user = await User.findByPk(image.UserId, {
    attributes: ["id", "username", "imageProfilePath"]
  })

  const filteredImage = await filterImages(req, image.toJSON())

  const imageDetails = {
    height: response.height,
    width: response.width,
    uploadDate: filteredImage.createdAt,
    location: filteredImage.location,
    caterogy: filteredImage.Caterogy.caterogyName,
  };

  const imageData = {
    name: filteredImage.imageName,
    price: filteredImage.price,
    path: filteredImage.imagePath,
    description: filteredImage.description,
    noOfLikes: filteredImage.noOfLikes,
    isLiked: filteredImage.isLiked,
    noOfViews: filteredImage.noOfViews
  };

  const userData = {
    username: user.username,
    profileImage: user.imageProfilePath,
    userId: user.id
  }

  res.status(200).json({ imageDetails, imageData, userData });
}

async function getCaterogyImages(req, res, next) {

  const caterogyName = req.params.caterogy;
  const page = +req.query.page || 1;

  const caterogy = await Caterogy.findByPk(caterogyName)

  if (!caterogy) {
    return next(new ApiError("No Caterogy By This Name Found", 404))
  }

  let images = await Image.findAll({
    where: {
      CaterogyId: caterogy.caterogyName,
    },
    attributes: ["id", "imageName", "price", "imagePath"],
    raw: true,
    limit: 6,
    offset: (page - 1) * 6
  });

  if (!images) {
    return next(new ApiError("No Images Found", 404))
  }

  images = await filterImages(req, images)

  res.status(200).json({ data: images });
}

async function getImagesByName(req, res, next) {

  const imageName = req.query.imageName;
  const page = +req.query.page || 1;

  let images = await Image.findAll({
    where: {
      imageName: {
        [Op.substring]: imageName,
      },
    },
    attributes: ["id", "imageName", "price", "imagePath"],
    raw: true,
    limit: 6,
    offset: (page - 1) * 6
  });

  if (!images) {
    return next(new ApiError("No Images Found", 404))
  }

  images = await filterImages(req, images)

  res.status(200).json({ data: images });
}

async function getImagesByPrice(req, res, next) {
  const order = req.query.order;

  const page = +req.query.page || 1;

  const images = await Image.findAll({
    order: [["price", order]],
    attributes: ["id", "imageName", "price", "imagePath"],
    offset: (page - 1) * 2,
    limit: 2,
  });

  if (!images) {
    return next(new ApiError("No Images Found", 404))
  }

  res.status(200).json({ data: images });
}

async function deleteUploadedImage(req, res, next) {

  const imageId = req.query.imageId

  const image = await Image.findByPk(imageId, {
    attributes: ["id", "imageKitId"]
  })

  if (!image) {
    return next(new ApiError("Image Not Found", 404))
  }

  await imageKit.deleteFile(image.imageKitId)

  await image.destroy()

  res.status(200).json({ Messge: "Image Deleted Successfully" })
}

async function searchByImage(req, res, next) {

  if (req.fileType) {
    // 415 -> Unsupported Media Type
    return next(new ApiError("(PNG OR JPG OR JPEG) Images Only!", 415))
  }

  const base64Image = req.file.buffer.toString('base64');

  const url = 'http://127.0.0.1:8080/search_image';
  const data = { image: base64Image };

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(async (data) => {

      const caterogyName = data.caterogy

      const caterogy = await Caterogy.findByPk(caterogyName)

      let images = await Image.findAll({
        where: {
          CaterogyId: caterogy.caterogyName,
        },
        attributes: ["id", "imageName", "price", "imagePath"],
        raw: true
      });

      if (!images) {
        return res.status(404).json({ error: "No Images Found" });
      }

      images = await filterImages(req, images)

      res.status(200).json({ data: images });
    })
}

async function downloadImage(req, res, next) {

  const imageId = req.params.imageId

  const image = await Image.findByPk(imageId, {
    attributes: ["imagePath", "imageName"]
  })

  const response = await axios.get(image.imagePath, {
    responseType: 'stream'
  })

  res.setHeader('Content-Type', response.headers['content-type'])
  res.setHeader("Content-Disposition", `attachment; filename=${image.imageName}`)
  res.status(200)

  response.data.pipe(res)

}


module.exports = {
  getImages,
  uploadImage,
  getSingleImage,
  getCaterogyImages,
  getImagesByName,
  getImagesByPrice,
  deleteUploadedImage,
  searchByImage,
  downloadImage
};
