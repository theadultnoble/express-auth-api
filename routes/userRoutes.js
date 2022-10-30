const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

router.post("/sign-up", async (req, res) => {
  try {
    //Extracting email and password from the req.body object
    const { email, password } = req.body;

    //Checking if email is already in use
    let userExists = await User.findOne({ email });
    if (userExists) {
      res.status(401).json({ message: "Email is already in use." });
      return;
    }

    //salting
    const saltRounds = 10;

    //Hashing a Password
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) throw new Error("Internal Server Error");

      //Creating a new user
      let user = new User({
        email,
        password: hash,
      });

      //Saving user to database
      user.save().then(() => {
        return res.json({ message: "User created successfully", user });
      });
    });
  } catch (err) {
    res.status(401).send(err.message);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    //Extracting email and password from the req.body object
    const { email, password } = req.body;

    //Checking if user exists in database
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    //Comparing provided password with password retrived from database
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        return res.status(200).json({ message: "User Logged in Successfully" });
      }

      console.log(err);
      return res.status(401).json({ message: "Invalid Credentials" });
    });
  } catch (error) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
