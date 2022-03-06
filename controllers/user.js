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

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "user not found, with the given email!",
    });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res.json({
      success: false,
      message: "email / password does not match!",
    });
};
