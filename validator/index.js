//signup validator
exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is required").notEmpty();
  req
    .check("email", "Valid email is required")
    .matches(/.\@.+\..+/)
    .withMessage("Please enter a valid email")
    .isLength({
      min: 4,
      max: 64,
    });
  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 chracters in length");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
