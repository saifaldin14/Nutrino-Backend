const jwt = require("jwt");
const User = require("../models/user");
const sharp = require("sharp");
const cloudinary = require("../helper/imageUpload");

exports.createUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);

  if (!isNewUser) {
    return res.json({
      success: false,
      message: "This email is already in use, try sign-in",
    });
  }

  const user = await User({
    fullName,
    email,
    password,
  });

  await user.save();
  res.json({ success: true, user });
};
