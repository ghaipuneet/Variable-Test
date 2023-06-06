// Connect to MongoDB and initialize the trade history collection
async connectToMongoDB(databaseURL, dbName, collectionName) {
  const client = new MongoClient(databaseURL);

  try {
    await client.connect();
    const db = client.db(dbName);
    this.tradeHistory = db.collection(collectionName);
    console.log('Connected to MongoDB and initialized trade history collection.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
