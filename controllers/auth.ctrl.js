const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");

const userModel = require("../models/user.model.js");

const secret_key = process.env.SECRET_KEY || "SECRET_KEY";

const login = async function (req, res) {
  const user = await userModel.findOne({ userName: req.body.userName });
  if (user === null) {
    return res.status(401).json({
      message: 'Invalid Authentication',
    });
  }

  if (bcrypt.compareSync(req.body.password, user.password) === false) {
    return res.status(401).json({
      message: 'Invalid Authentication',
    });
  }

  const payload = {
    userId: user.id,
    // roles: ['film:list', 'film:add', 'film:update', ...]
  };
  const opts = {
    expiresIn: 30, // seconds
  };
  const accessToken = jwt.sign(payload, secret_key, opts);

  const refreshToken = randomstring.generate(80);
  await userModel.findOneAndUpdate(user.id, {
    refreshToken: refreshToken,
  });

  res.json({
    result: user,
    message: "Authenticated",
    accessToken,
    refreshToken,
  });
};

const register = async function (req, res) {
  const {
    userType,
    firstName,
    lastName,
    userName,
    email,
    password
  } = req.body;
  const userExist =
    (await userModel.findOne({ email })) || userModel.findOne({ userName });
  console.log(userExist.id);
  if (userExist.id) {
    return res.status(400).json({ message: "User already exists." });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  
  try {
  var user = await userModel.create({
    userType,
    firstName,
    lastName,
    userName,
    email,
    password: hashedPassword,
  });
  const payload = {
    userId: user.id,
    // roles: ['film:list', 'film:add', 'film:update', ...]
  };
  const opts = {
    expiresIn: 10, // seconds
  };
    const accessToken = jwt.sign(payload, secret_key, opts);

    const refreshToken = randomstring.generate(80);
    await userModel.findOneAndUpdate(user.id, {
        refreshToken: refreshToken,
    });

    res.status(201).json({
      result: user,
      message: "Authenticated",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const refresh = async function (req, res) {
  const { accessToken, refreshToken } = req.body;
  try {
    const opts = {
      ignoreExpiration: true,
    };
    const { userId } = jwt.verify(accessToken, secret_key, opts);
    const ret = await userModel.findOne({ userId });
    if ((ret.refreshToken==refreshToken) === true) {
      const newAccessToken = jwt.sign({ userId }, secret_key, {
        expiresIn: 30,
      });
      return res.json({
        accessToken: newAccessToken,
      });
    }

    return res.status(401).json({
      message: "RefreshToken is revoked.",
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Invalid accessToken.",
    });
  }
};
module.exports = { login, register, refresh };
