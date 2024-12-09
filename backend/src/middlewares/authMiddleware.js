const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc    Protect routes (check if the user is logged in)
// @route   Middleware
// @access  Private
const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user data to the request object
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Allow the request to proceed
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If there's no token
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
