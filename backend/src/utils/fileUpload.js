const multer = require("multer");
const path = require("path");

// Set storage engine for multer
const storage = multer.diskStorage({
  // Destination for storing uploaded files
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store in 'uploads' directory
  },

  // Filename for the uploaded file
  filename: (req, file, cb) => {
    // Create a unique filename using the current date and original file extension
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name
  },
});

// Set file upload limit and validation rules
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max file size is 5MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // Accept images of these types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
    const mimetype = fileTypes.test(file.mimetype); // Check file MIME type

    if (extname && mimetype) {
      return cb(null, true); // Accept the file
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed.")); // Reject if file is not an image
    }
  },
}).single("file"); // 'file' is the field name in the form data

// Middleware to handle file uploads in routes
const fileUploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message }); // Send error response if file validation fails
    }
    next(); // Proceed to next middleware or route handler
  });
};

module.exports = fileUploadMiddleware;
