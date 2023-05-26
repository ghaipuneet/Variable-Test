// Import the necessary libraries.
const EventEmitter = require('events');
const util = require('util');

// Define the order matching engine class.
class OrderMatchingEngine extends EventEmitter {

  // Constructor.
  constructor() {
    super();

    // Initialize the order book.
    this.orderBook = new Map();

    // Initialize the market data.
    this.marketData = new Map();
  }

  // Add an order.
  addOrder(order) {
    // Check if the order is valid.
    if (!order.isValid()) {
      throw new Error('Invalid order');
    }

    // Add the order to the order book.
    this.orderBook.set(order.id, order);

    // Emit an event to notify listeners that an order has been added.
    this.emit('orderAdded', order);
  }

  // Remove an order.
  removeOrder(orderId) {
    // Check if the order exists.
    if (!this.orderBook.has(orderId)) {
      throw new Error('Order does not exist');
    }

    // Remove the order from the order book.
    this.orderBook.delete(orderId);

    // Emit an event to notify listeners that an order has been removed.
    this.emit('orderRemoved', orderId);
  }

  // Match orders.
  matchOrders() {
    // Get all of the buy orders.
    const buyOrders = Array.from(this.orderBook.values());

    // Get all of the sell orders.
    const sellOrders = Array.from(this.orderBook.values());

    // Sort the buy orders by price.
    buyOrders.sort((a, b) => a.price - b.price);

    // Sort the sell orders by price.
    sellOrders.sort((a, b) => b.price - a.price);

    // Loop through the buy orders and sell orders.
    for (let i = 0; i < buyOrders.length; i++) {
      for (let j = 0; j < sellOrders.length; j++) {

        // Check if the buy order can be matched with the sell order.
        if (buyOrders[i].side === 'buy' && sellOrders[j].side === 'sell' && buyOrders[i].price >= sellOrders[j].price) {

          // Match the orders.
          const filledQuantity = Math.min(buyOrders[i].quantity, sellOrders[j].quantity);
          buyOrders[i].quantity -= filledQuantity;
          sellOrders[j].quantity -= filledQuantity;

          // Emit an event to notify listeners that an order has been matched.
          this.emit('orderMatched', {
            buyOrder: buyOrders[i],
            sellOrder: sellOrders[j],
            filledQuantity: filledQuantity
          });

          // If the buy order is no longer valid, remove it from the order book.
          if (buyOrders[i].quantity === 0) {
            this.removeOrder(buyOrders[i].id);
          }

          // If the sell order is no longer valid, remove it from the order book.
          if (sellOrders[j].quantity === 0) {
            this.removeOrder(sellOrders[j].id);
          }

          // Break out of the loop.
          break;
        }
      }
    }
  }
}

// Export the order matching engine class.
module.exports = OrderMatchingEngine;
