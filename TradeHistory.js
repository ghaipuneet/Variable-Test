const { MongoClient } = require('mongodb');

class TradeHistory {
  constructor(databaseURL, dbName, collectionName) {
    this.databaseURL = databaseURL;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.collection = null; // Placeholder for the MongoDB collection
  }

  async connectToMongoDB() {
    const client = new MongoClient(this.databaseURL);

    try {
      await client.connect();
      const db = client.db(this.dbName);
      this.collection = db.collection(this.collectionName);
      console.log('Connected to MongoDB and initialized trade history collection.');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  async addTrade(trade) {
    try {
      await this.collection.insertOne(trade);
      console.log('Trade added to trade history:', trade);
    } catch (error) {
      console.error('Error adding trade to trade history:', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  async getAllTrades() {
    try {
      const trades = await this.collection.find({}).toArray();
      console.log('All trades:', trades);
      return trades;
    } catch (error) {
      console.error('Error retrieving all trades:', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  async getTradesByOrderID(orderID) {
    try {
      const trades = await this.collection.find({ $or: [{ buyOrderID: orderID }, { sellOrderID: orderID }] }).toArray();
      console.log(`Trades for order ID ${orderID}:`, trades);
      return trades;
    } catch (error) {
      console.error(`Error retrieving trades for order ID ${orderID}:`, error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }
}

module.exports = TradeHistory;
