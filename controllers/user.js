
const User = require("../models/user");
const Image = require("../models/image");
const Order = require("../models/order");

const imageKit = require("../util/image-kit")

async function likeImage(req, res) {

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "User IS Not Authenticated" });
  }

  const imageId = req.params.imageId;

  const image = await Image.findByPk(imageId, {
    attributes: ["id", "noOfLikes"]
  })

  if (!image) {
    return res.status(404).json({ message: "No Image Found" });
  }

  await image.update({
    noOfLikes: image.noOfLikes + 1
  })

  await image.addUser(userId);

  res.status(200).json({ message: "User liked The Image Successfully" });
}

async function unlikeImage(req, res) {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "User IS Not Authenticated" });
  }

  const imageId = req.params.imageId;

  const image = await Image.findByPk(imageId, {
    attributes: ["id", "noOfLikes"]
  })

  if (!image) {
    return res.status(404).json({ message: "No Image found" });
  }

  await image.update({
    noOfLikes: image.noOfLikes - 1
  })

  await image.removeUser(userId)

  res.status(200).json({ message: "User Unliked The Image" });
}

async function getLikedImages(req, res) {
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
    return res.status(404).json({ error: "No Liked Images Found" });
  }

  res.status(200).json(user.Images);
}

async function getUploadedImages(req, res) {
  const userId = req.userId;

  const images = await Image.findAll({
    where: {
      UserId: userId,
    },
    attributes: ["id", "imagePath"],
  });

  res.status(200).json(images);
}

async function getOrderedImages(req, res) {
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
    return res.status(404).json({ error: "No Order found" });
  }

  res.status(200).json(order.Images);
}

async function deleteUser(req, res, next) {

  const userId = req.userId;

  const images = await Image.findAll({
    where: {
      UserId: 1,
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

  await imageKit.bulkDeleteFiles(imagesIds)

  await user.destroy()

  res.status(200).json({ message: "User Deleted Successfully" });
}

async function loadUserProfile(req, res) {
  const userId = req.userId;

  const user = await User.findByPk(userId, {
    attributes: [
      "username",
      "followingNum",
      "followersNum",
      "imageProfilePath",
    ],
  });

  if (!user) {
    return res.status(404).json({ error: "No User Found" });
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
