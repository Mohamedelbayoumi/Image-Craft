const { Op } = require("sequelize");

const Image = require("../models/image");
const Caterogy = require("../models/caterogy");
const User = require("../models/user");

const imageKit = require("../util/image-kit")

const filterImages = require("../util/isLiked")


async function getImages(req, res) {

  let images = await Image.findAll({
    attributes: ["id", "imageName", "price", "imagePath"],
    raw: true
  });


  if (!images) {
    return res.status(404).json({ error: "No Images Found" });
  }

  images = await filterImages(req, images)


  res.status(200).json({ data: images });
}

async function uploadImage(req, res) {

  if (req.fileType) {
    return res.status(400).json({ errorMessage: req.fileType })
  }

  const userId = req.userId;

  const { caterogy, imageName, price, description, location } = req.body;

  const imageCaterogy = await Caterogy.findOne({
    where: {
      caterogyName: caterogy,
    },
    attributes: ["id"],
  });


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
    imagePath: response.thumbnailUrl,
    UserId: userId,
    imageKitId: response.fileId
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
    raw: true, nest: true
  });

  if (!image) {
    return res.status(404).json({ error: "Image Not Found" });
  }

  const response = await imageKit.getFileDetails(image.imageKitId)

  const user = await User.findByPk(image.UserId, {
    attributes: ["id", "username", "imageProfilePath"]
  })

  const filteredImage = await filterImages(req, image)

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
    isLiked: filteredImage.isLiked
  };

  const userData = {
    username: user.username,
    profileImage: user.imageProfilePath,
    userId: user.id
  }

  res.status(200).json({ imageDetails, imageData, userData });
}

async function getCaterogyImages(req, res) {
  const caterogyName = req.params.caterogy;


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

  let images = await Image.findAll({
    where: {
      CaterogyId: caterogy.id,
    },
    attributes: ["id", "imageName", "price", "imagePath"],
    raw: true
  });

  if (!images) {
    return res.status(404).json({ error: "No Images Found" });
  }

  images = await filterImages(req, images)

  res.status(200).json({ data: images });
}

async function getImagesByName(req, res) {
  const imageName = req.query.imageName;

  let images = await Image.findAll({
    where: {
      imageName: {
        [Op.substring]: imageName,
      },
    },
    attributes: ["id", "imageName", "price", "imagePath"],
    raw: true
  });

  if (!images) {
    return res.status(404).json({ message: "No Images Found" });
  }

  images = await filterImages(req, images)

  res.status(200).json({ data: images });
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

  res.status(200).json({ data: images });
}

async function deleteUploadedImage(req, res, next) {

  const imageId = req.query.imageId

  const image = await Image.findByPk(imageId, {
    attributes: ["id", "imageKitId"]
  })

  if (!image) {
    return res.status(404).json({ Messge: "Image Not Found" })
  }

  await imageKit.deleteFile(image.imageKitId)

  await image.destroy()

  res.status(200).json({ Messge: "Image Deleted Successfully" })
}

async function searchByImage(req, res, next) {

  if (req.fileType) {
    return res.status(400).json({ errorMessage: req.fileType })
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
      console.log(data)
      const caterogyName = data.caterogy

      const caterogy = await Caterogy.findOne({
        where: {
          caterogyName,
        },
        attributes: ["id"],
      });

      let images = await Image.findAll({
        where: {
          CaterogyId: caterogy.id,
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
    .catch(error => next(error));
}

module.exports = {
  getImages,
  uploadImage,
  getSingleImage,
  getCaterogyImages,
  getImagesByName,
  getImagesByPrice,
  deleteUploadedImage,
  searchByImage
};
