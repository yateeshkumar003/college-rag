const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE ERROR] MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
