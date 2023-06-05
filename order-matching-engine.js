// OrderMatchingEngine.js

// Import the MongoDB driver
const { MongoClient } = require('mongodb');

class InvalidOrderError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidOrderError';
  }
}

class InvalidOrderSideError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidOrderSideError';
  }
}

class OrderBook {
  constructor() {
    this.bids = [];
    this.asks = [];
  }

  addOrder(order) {
    if (!order || !order.price || !order.quantity || !order.side || !order.type) {
      throw new InvalidOrderError('Invalid order format');
    }
    if (order.side !== 'buy' && order.side !== 'sell') {
      throw new InvalidOrderSideError('Invalid order side');
    }
    if (order.side === 'buy') {
      this.bids.push(order);
    } else {
      this.asks.push(order);
    }
  }

  matchOrders() {
    // Match orders based on price
    for (let bid of this.bids) {
      for (let ask of this.asks) {
        if (bid.price >= ask.price) {
          // Perform order matching algorithm and handle executed trades
          let quantityToMatch = Math.min(bid.quantity, ask.quantity);
          // Handle slippage
          let executedPrice = this.calculateExecutedPrice(bid.price, ask.price);
          // Apply fees and rebates
          let feeAmount = this.calculateFee(executedPrice, quantityToMatch);
          let rebateAmount = this.calculateRebate(executedPrice, quantityToMatch);
          // Handle liquidity
          let liquidity = this.checkLiquidity(quantityToMatch);
          if (liquidity < quantityToMatch) {
            throw new Error('Insufficient liquidity to execute order');
          }
          // Update order quantities and execute the trade
          bid.quantity -= quantityToMatch;
          ask.quantity -= quantityToMatch;
          if (bid.quantity === 0) {
            this.bids.remove(bid);
          }
          if (ask.quantity === 0) {
            this.asks.remove(ask);
          }
          // Persist executed trade details to MongoDB
          this.persistExecutedTrade(bid, ask, quantityToMatch, executedPrice, feeAmount, rebateAmount);
        }
      }
    }
  }

  calculateExecutedPrice(bidPrice, askPrice) {
    // Calculate the executed price considering slippage
    // You can implement your own slippage logic here
    // For simplicity, we'll assume the executed price is the average of the bid and ask prices
    return (bidPrice + askPrice) / 2;
  }

  calculateFee(executedPrice, quantity) {
    // Calculate the fee based on the executed price and quantity
    // You can implement your own fee calculation logic here
    // For simplicity, we'll assume a fixed fee of 0.1% of the executed value
    const feePercentage = 0.001;
    const executedValue = executedPrice * quantity;
    return executedValue * feePercentage;
  }

  calculateRebate(executedPrice, quantity) {
    // Calculate the rebate based on the executed price and quantity
    // You can implement your own rebate calculation logic here
    // For simplicity, we'll assume a fixed rebate of 0.01% of the executed value
    const rebatePercentage = 0.0001;
    const executedValue = executedPrice * quantity;
    return executedValue * rebatePercentage;
  }

  checkLiquidity(quantity) {
    // Check the available liquidity to ensure it can accommodate the requested quantity
    // You can implement your own liquidity checking logic here
    // For simplicity, we'll assume a fixed liquidity of 100 units
    const availableLiquidity = 100;
    return availableLiquidity;
  }

  persistExecutedTrade(bid, ask, quantity, price, fee, rebate) {
    // Persist the executed trade details to MongoDB
    const trade = {
      bidOrderId: bid.orderId,
      askOrderId: ask.orderId,
      quantity,
      price,
      fee,
      rebate,
      timestamp: new Date()
    };

    // Connect to MongoDB and insert the trade record
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
      if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
      }

      const db = client.db('orderbook');
      const tradesCollection = db.collection('trades');

      tradesCollection.insertOne(trade, (err, result) => {
        if (err) {
          console.error('Failed to insert trade record:', err);
        } else {
          console.log('Trade record inserted:', result.insertedId);
        }

        // Close the MongoDB connection
        client.close();
      });
    });
  }

  getBestBid() {
    if (this.bids.length === 0) {
      return null;
    }
    return this.bids.reduce((a, b) => (a.price > b.price ? b : a));
  }

  getBestAsk() {
    if (this.asks.length === 0) {
      return null;
    }
    return this.asks.reduce((a, b) => (a.price < b.price ? b : a));
  }
}

class Order {
  constructor(orderId, price, quantity, side, type, userId) {
    this.orderId = orderId;
    this.price = price;
    this.quantity = quantity;
    this.side = side;
    this.type = type;
    this.userId = userId;
  }
}

class OrderMatchingEngine {
  constructor() {
    this.orderBook = new OrderBook();
  }

  addOrder(order) {
    this.orderBook.addOrder(order);
    // Persist the order details to MongoDB
    this.persistOrder(order);
  }

  matchOrders() {
    this.orderBook.matchOrders();
  }

  getBestBid() {
    return this.orderBook.getBestBid();
  }

  getBestAsk() {
    return this.orderBook.getBestAsk();
  }

  persistOrder(order) {
    // Persist the order details to MongoDB
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
      if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
      }

      const db = client.db('orderbook');
      const ordersCollection = db.collection('orders');

      ordersCollection.insertOne(order, (err, result) => {
        if (err) {
          console.error('Failed to insert order record:', err);
        } else {
          console.log('Order record inserted:', result.insertedId);
        }

        // Close the MongoDB connection
        client.close();
      });
    });
  }

  cancelOrder(orderId) {
    // Remove the order from the order book
    const removedOrder = this.removeOrder(orderId);
    if (removedOrder) {
      // Mark the order as cancelled in the database
      this.markOrderAsCancelled(orderId);
    }
  }

  modifyOrder(orderId, newQuantity, newPrice) {
    // Find the order in the order book
    const order = this.findOrder(orderId);
    if (order) {
      // Update the order with the new quantity and price
      order.quantity = newQuantity;
      order.price = newPrice;
      // Calculate the liquidation point based on the updated margin and price
      const liquidationPoint = this.calculateLiquidationPoint(order.margin, newPrice);
      // Update the liquidation point in the database
      this.updateLiquidationPoint(orderId, liquidationPoint);
    }
  }

  removeOrder(orderId) {
    // Remove the order from the order book
    const removedOrder = this.orderBook.removeOrder(orderId);
    if (removedOrder) {
      // Remove the order from the database
      this.removeOrderFromDatabase(orderId);
    }
    return removedOrder;
  }

  markOrderAsCancelled(orderId) {
    // Update the order status as cancelled in the database
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
      if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
      }

      const db = client.db('orderbook');
      const ordersCollection = db.collection('orders');

      ordersCollection.updateOne({ orderId }, { $set: { status: 'cancelled' } }, (err, result) => {
        if (err) {
          console.error('Failed to mark order as cancelled:', err);
        } else {
          console.log('Order marked as cancelled:', result.modifiedCount);
        }

        // Close the MongoDB connection
        client.close();
      });
    });
  }

  calculateLiquidationPoint(margin, price) {
    // Calculate the liquidation point based on the margin and price
    // You can implement your own liquidation point calculation logic here
    // For simplicity, we'll assume a fixed liquidation point of 50% margin ratio
    const liquidationPoint = margin * price * 0.5;
    return liquidationPoint;
  }

  updateLiquidationPoint(orderId, liquidationPoint) {
    // Update the liquidation point of the order in the database
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
      if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
      }

      const db = client.db('orderbook');
      const ordersCollection = db.collection('orders');

      ordersCollection.updateOne({ orderId }, { $set: { liquidationPoint } }, (err, result) => {
        if (err) {
          console.error('Failed to update liquidation point:', err);
        } else {
          console.log('Liquidation point updated:', result.modifiedCount);
        }

        // Close the MongoDB connection
        client.close();
      });
    });
  }

  removeOrderFromDatabase(orderId) {
    // Remove the order from the database
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
      if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
      }

      const db = client.db('orderbook');
      const ordersCollection = db.collection('orders');

      ordersCollection.deleteOne({ orderId }, (err, result) => {
        if (err) {
          console.error('Failed to remove order from database:', err);
        } else {
          console.log('Order removed from database:', result.deletedCount);
        }

        // Close the MongoDB connection
        client.close();
      });
    });
  }
}

// Usage example

const orderMatchingEngine = new OrderMatchingEngine();

// Add orders
const order1 = new Order('1', 10, 5, 'buy', 'limit', 'user1');
orderMatchingEngine.addOrder(order1);

const order2 = new Order('2', 12, 3, 'sell', 'limit', 'user2');
orderMatchingEngine.addOrder(order2);

const order3 = new Order('3', 15, 8, 'buy', 'market', 'user3');
orderMatchingEngine.addOrder(order3);

const order4 = new Order('4', 9, 4, 'sell', 'stop_market', 'user4');
orderMatchingEngine.addOrder(order4);

// Match orders
orderMatchingEngine.matchOrders();

// Get best bid and ask
const bestBid = orderMatchingEngine.getBestBid();
const bestAsk = orderMatchingEngine.getBestAsk();

console.log('Best bid:', bestBid);
console.log('Best ask:', bestAsk);

// Cancel order
orderMatchingEngine.cancelOrder('1');

// Modify order
orderMatchingEngine.modifyOrder('2', 2, 14);

// Match orders again after cancellation and modification
orderMatchingEngine.matchOrders();

// node.js main function
const main = () => {
    const orderMatchingEngine = new OrderMatchingEngine();
  
    // Add some orders
    orderMatchingEngine.addOrder(new Order(100, 10, 'buy', 'limit'));
    orderMatchingEngine.addOrder(new Order(101, 10, 'sell', 'market'));
    orderMatchingEngine.addOrder(new Order(102, 10, 'buy', 'stop-loss'));
    orderMatchingEngine.addOrder(new Order(103, 10, 'sell', 'stop-limit'));
  
    // Match orders
    orderMatchingEngine.matchOrders();
  
    // Print the best bid and ask
    console.log(orderMatchingEngine.getBestBid());
    console.log(orderMatchingEngine.getBestAsk());
  };
  
  if (require.main === module) {
    main();
  }
  
  module.exports = {
    OrderMatchingEngine,
    Order,
    InvalidOrderError,
    InvalidOrderSideError,
  };
