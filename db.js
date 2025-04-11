const mongoose = require("mongoose");
require("dotenv").config();

// Define the MongoDB connection URL
const mongoURL = process.env.MONGODB_URI; // Replace 'mydatabase' with your database name
// const mongoURL = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
    const conn = await mongoose.connect(mongoURL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: {conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

//* Export the database connection
module.exports = connectDB;
