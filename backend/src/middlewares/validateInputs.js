const { body, validationResult } = require("express-validator");

// @desc    Validate user inputs
// @route   Middleware (can be used for any route that requires validation)
// @access  Public
const validateUserInputs = [
  // Validate and sanitize the username
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .trim()
    .escape(),

  // Validate and sanitize the email
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  // Validate and sanitize the password
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // Middleware to check if there are any validation errors
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next(); // Proceed to the next middleware or route handler
  },
];

module.exports = { validateUserInputs };
