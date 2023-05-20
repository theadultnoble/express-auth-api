const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
require("dotenv").config(); // Load the .env file

module.exports = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  //Extracting token from authorization header
  const { authorization } = req.headers;
  //authorization === 'Bearer "token"'
  if (!authorization) {
    return res.status(404).send({ error: "must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");

  //Verifying if the token is valid.
  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(403).send("Could not verify token");
    }

    const { email } = payload;
    const user = await User.findOne(email);
    console.log(user);
    req.user = user;
  });
  next();
};
