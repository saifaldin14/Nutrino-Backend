const express = require("express");

const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
} = require("../controllers/user");
const { isAuth } = require("../middlewares/auth");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middlewares/validation/user");

const multer = require("multer");

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimeType.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
router.post("/sign-out", isAuth, signOut);
router.post(
  "/upload-profile",
  isAuth,
  uploads.single("profile"),
  uploadProfile
);

module.exports = router;
