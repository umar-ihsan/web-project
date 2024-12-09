const errorHandler = (err, req, res, next) => {
    // Set default status code to 500 (Internal Server Error)
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Error";
  
    // Handle specific error types
    if (err.name === "CastError" && err.kind === "ObjectId") {
      statusCode = 400;
      message = "Resource not found";
    }
  
    if (err.code === 11000) {
      // Duplicate key error (for example, when a user tries to create an account with a duplicate email or username)
      statusCode = 400;
      message = "Duplicate field value entered";
    }
  
    if (err.name === "ValidationError") {
      // Handle Mongoose validation errors
      statusCode = 400;
      message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    }
  
    // Log the error (for development only)
    console.error(err.stack);
  
    // Send the error response
    res.status(statusCode).json({
      success: false,
      message,
    });
  };
  
  module.exports = errorHandler;
  