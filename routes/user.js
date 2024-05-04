const router = require("express").Router();

const passTheImage = require("../middleware/upload");

const checkAuthentication = require("../middleware/isAuth");

const {
  likeImage,
  unlikeImage,
  getLikedImages,
  getUploadedImages,
  getOrderedImages,
  editImageProfie,
  deleteUser,
  loadUserProfile,
} = require("../controllers/user");

router.post("/images/like/:imageId", checkAuthentication, likeImage);

router.post("/images/unlike/:imageId", checkAuthentication, unlikeImage);

router.get("/profile/liked-images", checkAuthentication, getLikedImages);

router.get("/profile/uploaded-images", checkAuthentication, getUploadedImages);

router.get("/profile/ordered-images", checkAuthentication, getOrderedImages);

router.patch("/profile/image", [
  checkAuthentication,
  passTheImage("./profile-images"),
  editImageProfie,
]);

router.get("/profile", checkAuthentication, loadUserProfile);

router.delete("/user", checkAuthentication, deleteUser);

module.exports = router;
