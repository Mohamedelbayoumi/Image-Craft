
const User = require("../models/user");
const Image = require("../models/image");
const Order = require("../models/order");

const imageKit = require("../config/image-kit")

const ApiError = require('../util/customError')

async function likeImage(req, res, next) {

  const userId = req.userId;
  const imageId = req.params.imageId;

  const image = await Image.findByPk(imageId, {
    attributes: ["id", "noOfLikes"]
  })

  if (!image) {
    return next(new ApiError("No Image Found", 404))
  }

  await image.update({
    noOfLikes: image.noOfLikes + 1
  })

  await image.addUser(userId);

  res.status(200).json({ message: "User liked The Image Successfully" });
}

async function unlikeImage(req, res, next) {

  const userId = req.userId;
  const imageId = req.params.imageId;

  const image = await Image.findByPk(imageId, {
    attributes: ["id", "noOfLikes"]
  })

  if (!image) {
    return next(new ApiError("No Image Found", 404))
  }

  await image.update({
    noOfLikes: image.noOfLikes - 1
  })

  await image.removeUser(userId)

  res.status(200).json({ message: "User Unliked The Image" });
}

async function getLikedImages(req, res, next) {
  const userId = req.userId;

  const user = await User.findByPk(userId, {
    attributes: [],
    include: {
      model: Image,
      required: true,
      attributes: ["id", "imagePath"],
      through: {
        attributes: [],
      },
    },
  });

  if (!user) {
    return next(new ApiError("No Liked Images Found", 404))
  }

  res.status(200).json({ data: user.Images });

}

async function getUploadedImages(req, res, next) {
  const userId = req.userId;

  const images = await Image.findAll({
    where: {
      UserId: userId,
    },
    attributes: ["id", "imagePath"],
  });

  if (!images) {
    return next(new ApiError("No Uploaded Images Found", 404))
  }

  res.status(200).json({ data: images });
}

async function getOrderedImages(req, res, next) {
  const userId = req.userId;

  const order = await Order.findOne({
    where: {
      UserId: userId,
    },
    include: {
      model: Image,
      required: true,
      attributes: ["id", "imagePath"],
      through: {
        attributes: [],
      },
    },
    attributes: [],
  });

  if (!order) {
    return next(new ApiError("No Order found", 404))
  }

  res.status(200).json({ data: order.Images });

}

async function deleteUser(req, res, next) {

  const userId = req.userId;

  const images = await Image.findAll({
    where: {
      UserId: userId,
    },
    attributes: ["imageKitId"]
  });

  const imagesIds = images.map((e) => {
    return e.imageKitId
  })

  const user = await User.findByPk(userId, {
    attributes: ["id", "imageKitId"]
  })

  imagesIds.push(user.imageKitId)

  if (imagesIds.length > 0 && user.imageKitId != null) {

    await imageKit.bulkDeleteFiles(imagesIds)

  }

  await user.destroy()

  res.status(200).json({ message: "User Deleted Successfully" });
}

async function loadUserProfile(req, res, next) {

  const userId = req.userId;

  const user = await User.findByPk(userId, {
    attributes: [
      "username",
      "imageProfilePath"
    ],
  });

  if (!user) {
    return next(new ApiError("No User Found", 404))
  }

  const images = await Image.findAll({
    where: {
      UserId: userId,
    },
    attributes: ["id", "imagePath"],
  });

  res.status(200).json({ userInfo: user, uploadedImages: images });
}

async function editImageProfie(req, res) {

  if (req.fileType) {
    // 415 -> Unsupported Media Type
    return next(new ApiError("(PNG OR JPG OR JPEG) Images Only!", 415))
  }

  const userId = req.userId;

  const response = await imageKit.upload({
    file: req.file.buffer,
    folder: "profile-images",
    fileName: req.file.originalname
  })

  await User.update(
    {
      imageProfilePath: response.thumbnailUrl,
      imageKitId: response.fileId
    },
    {
      where: {
        id: userId,
      },
    }
  );

  res.status(200).json({ Messge: "Image Changed Successfully" });
}

module.exports = {
  likeImage,
  unlikeImage,
  getLikedImages,
  getUploadedImages,
  getOrderedImages,
  editImageProfie,
  deleteUser,
  loadUserProfile,
};
