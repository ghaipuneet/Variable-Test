// errorLogging.js

// Import the necessary MongoDB client library
const { MongoClient } = require('mongodb');

// Connection URL for MongoDB
const mongoURL = 'mongodb://localhost:27017';

// Database name
const dbName = 'orderMatchingEngine';

// Collection name for error logs
const collectionName = 'errorLogs';

// Function to log errors to MongoDB
async function logError(error) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);

    // Get the error logs collection
    const collection = db.collection(collectionName);

    // Create the error log document
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error.toString(),
      severity: 'Critical', // Replace with appropriate severity level
      // Include any additional information you want to log
      // e.g., userId, ethAddress, etc.
    };

    // Insert the log entry into the collection
    await collection.insertOne(logEntry);

    // Close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error logging failed:', err);
  }
}

// Example usage
try {
  // Code that may throw an error
  throw new Error('Example error');
} catch (error) {
  // Log the error
  logError(error);
}
