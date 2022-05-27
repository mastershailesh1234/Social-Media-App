const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const possibleUser = await User.findOne({ email: req.body.email });
    if (possibleUser) {
      return res.status(400).json({
        message: "Email Id Already Exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = Object.assign(
      { username: req.body.username },
      { email: req.body.email },
      { password: hashedPassword }
    );

    //save user and respond
    const user = await User.create(newUser);
    if (user) {
      res.status(200).json({
        message: "Successfully Registered",
      });
    } else {
      res.status(400).json({
        message: "Failed To Register",
      });
    }
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({
        message: "User Doesnot Exist",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json("wrong password");
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
