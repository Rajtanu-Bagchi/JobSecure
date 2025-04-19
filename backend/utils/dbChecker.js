const mongoose = require('mongoose');

/**
 * Checks if MongoDB connection is available
 * @returns {Promise<boolean>} - True if connection is successful, false otherwise
 */
const checkDatabaseConnection = async () => {
  try {
    // Try to connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobsecure', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
    });
    
    // Close the connection
    await mongoose.connection.close();
    
    return true;
  } catch (error) {
    console.error('MongoDB connection check failed:', error.message);
    return false;
  }
};

module.exports = checkDatabaseConnection;
