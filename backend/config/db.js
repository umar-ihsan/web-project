const mongoose = require('mongoose');
const { mongoUrl } = require('../keys');

const connectDB = async () => {
    console.log('in the connection func');
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/myLocalDB', { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
