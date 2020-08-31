const express = require("express");
const router = express.Router();
const { userById } = require("../controller/user");
const { requireSignin, isAdmin, isAuth } = require("../controller/auth");

// runs anytime there is a user-id involved
router.param("userId", userById);

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({ user: req.profile });
});

module.exports = router;
