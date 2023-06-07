const { MongoClient } = require('mongodb');

class TradeHistory {
  constructor() {
    this.collectionName = 'trades';
    this.client = null;
    this.db = null;
  }

  async connect(url, dbName) {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10, // Maximum number of connections in the pool
      };
      this.client = await MongoClient.connect(url, options);
      this.db = this.client.db(dbName);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  async addTrade(trade) {
    try {
      const collection = this.db.collection(this.collectionName);
      await collection.insertOne(trade);
      console.log('Trade added to TradeHistory');
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  }

  async retrieveAllTrades() {
    try {
      const collection = this.db.collection(this.collectionName);
      const trades = await collection.find({}).toArray();
      return trades;
    } catch (error) {
      console.error('Error retrieving trades:', error);
      return [];
    }
  }

  async retrieveTradesByOrderId(orderId) {
    try {
      const collection = this.db.collection(this.collectionName);
      const trades = await collection.find({ $or: [{ buyOrderId: orderId }, { sellOrderId: orderId }] }).toArray();
      return trades;
    } catch (error) {
      console.error('Error retrieving trades by order ID:', error);
      return [];
    }
  }

  async retrieveTradesByUserId(userId) {
    try {
      const collection = this.db.collection(this.collectionName);
      const trades = await collection.find({ userId }).toArray();
      return trades;
    } catch (error) {
      console.error('Error retrieving trades by user ID:', error);
      return [];
    }
  }

  async retrievePaginatedTrades(page, limit) {
    try {
      const collection = this.db.collection(this.collectionName);
      const trades = await collection.find({}).skip((page - 1) * limit).limit(limit).toArray();
      return trades;
    } catch (error) {
      console.error('Error retrieving paginated trades:', error);
      return [];
    }
  }

  async retrieveTradesByDateRange(startDate, endDate) {
    try {
      const collection = this.db.collection(this.collectionName);
      const trades = await collection.find({ timestamp: { $gte: startDate, $lte: endDate } }).toArray();
      return trades;
    } catch (error) {
      console.error('Error retrieving trades by date range:', error);
      return [];
    }
  }

  async archiveTradesOlderThan(date) {
    try {
      const collection = this.db.collection(this.collectionName);
      await collection.deleteMany({ timestamp: { $lt: date } });
      console.log('Trades older than', date, 'archived');
    } catch (error) {
      console.error('Error archiving trades:', error);
    }
  }
}

// Usage example
const tradeHistory = new TradeHistory();
const mongodbUrl = 'mongodb://localhost:27017';
const databaseName = 'your_database_name';

// Connect to MongoDB using connection pooling
tradeHistory.connect(mongodbUrl, databaseName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10, // Maximum number of connections in the pool
  })
    .then(async () => {
      // Perform trade history operations
      const trades = await tradeHistory.retrieveAllTrades();
      console.log('All trades:', trades);
  
      const orderId = 'your_order_id';
      const tradesByOrderId = await tradeHistory.retrieveTradesByOrderId(orderId);
      console.log('Trades by order ID:', tradesByOrderId);
  
      const userId = 'your_user_id';
      const tradesByUserId = await tradeHistory.retrieveTradesByUserId(userId);
      console.log('Trades by user ID:', tradesByUserId);
  
      const page = 1;
      const limit = 10;
      const paginatedTrades = await tradeHistory.retrievePaginatedTrades(page, limit);
      console.log('Paginated trades:', paginatedTrades);
  
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const tradesByDateRange = await tradeHistory.retrieveTradesByDateRange(startDate, endDate);
      console.log('Trades by date range:', tradesByDateRange);
  
      const archiveDate = new Date('2022-06-01');
      await tradeHistory.archiveTradesOlderThan(archiveDate);
  
      // Disconnect from MongoDB
      tradeHistory.disconnect();
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
  
