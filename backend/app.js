require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

// Import the MongoDB connection function
const connectDB = require('./config/db'); 

// Use CORS
app.use(cors({
  origin: '*',  // Allow only localhost:3000 to make requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']  // Allow certain headers
}));

// Import models and routes
require('./models/model');
require('./models/post');
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));



// Connect to MongoDB
connectDB();

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
