const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandlers");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//signup method

exports.signup = (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

//sign in method

exports.signin = (req, res) => {
  //find the user based on the email and run the callback function once found
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "This email is not registered. Please signup",
      });
    }

    //if user found. match the email and password
    //create authenticate method in user model

    if (!user.authenticate(password)) {
      res.status(401).json({
        error: "Email and password do not match.",
      });
    }

    //generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    //persist the token as 't' in the cookie with an expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });

    //return response with user and token to the frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

//signout method
exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout successful" });
};

//signin required for certain areas can use the following function.

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

//is Authorised section

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!user) {
    return res.status(403).json({ error: "Access denied. Please Sign in" });
  }
  next();
};

//admin and is authorised

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin right required to acceess the area",
    });
  }
  next();
};
