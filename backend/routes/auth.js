const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const jwt_Secret = "iamagoodboy";

//ROUTE-1 Create a user using POST: in('/api/auth/createuser)
router.post(
  "/createuser",
  [
    // username must be an email
    body("email", "enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body("password", "password must be 5 character long").isLength({ min: 5 }),
    body("name", "enter a valid name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success=false;
    //If there are error return bad error and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try {
      //Check whether a user with same email existed or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "sorry a user existed with this email" });
      }

      const salt = await bcrypt.genSalt(10);
      secpassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secpassword,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, jwt_Secret);

      // res.json(user);
      success=true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//ROUTE-2 Authenticate a user using POST: in('/api/auth/createuser)
router.post(
  "/login",
  [
    // username must be an email
    body("email", "enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success=false;
        return res
          .status(400)
          .json({success, error: "Try to login with correct credentials" });
      }

      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, jwt_Secret);
      success=true;
      res.json({ success,authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route-3 Get a LoggedIn user Detail in using POST: in('/api/auth/getUser) login required
router.post(
  "/getuser",fetchuser, async (req, res) => {
    
    try {
      userid = req.user.id; 
      const user = await User.findById(userid).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);
module.exports = router;
