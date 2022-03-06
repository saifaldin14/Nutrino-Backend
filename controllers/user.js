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

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  let oldTokens = user.tokens || [];

  if (oldTokens.length) {
    oldTokens = oldTokens.filter((t) => {
      const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
      if (timeDiff < 86400) {
        return t;
      }
    });
  }

  await User.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  });

  const userInfo = {
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar ? user.avatar : "",
  };

  res.json({ success: true, user: userInfo, token });
};
