// OrderBook class
class OrderBook {
  constructor() {
    this.bids = new SkipList();
    this.asks = new SkipList();
    this.openPositions = new Map();
    this.feePercentage = 0.1; // Example fee percentage, adjust as needed
  }

  // Add an order to the order book
  addOrder(order) {
    if (order.type === "bid") {
      this.bids.add(order);
    } else {
      this.asks.add(order);
    }
  }

  // Get the best bid and ask prices
  getBestBid() {
    return this.bids.first();
  }

  getBestAsk() {
    return this.asks.first();
  }

  // Get the number of orders in the order book
  getSize() {
    return this.bids.size() + this.asks.size();
  }

  // Get the total quantity of orders in the order book
  getQuantity() {
    return this.bids.getTotalQuantity() + this.asks.getTotalQuantity();
  }

  // Get the average price of orders in the order book
  getAveragePrice() {
    return this.getQuantity() / this.getSize();
  }

  // Modify an order in the order book
  modifyOrder(order) {
    if (order.type === "bid") {
      this.bids.modify(order);
    } else {
      this.asks.modify(order);
    }
  }

  // Cancel an order in the order book
  cancelOrder(orderId) {
    this.bids.remove(orderId);
    this.asks.remove(orderId);
  }

  // Get all orders in the order book
  getOrders() {
    return this.bids.getAll() + this.asks.getAll();
  }

  // Add an open position
  addOpenPosition(position) {
    this.openPositions.set(position.id, position);
  }

  // Remove an open position
  removeOpenPosition(positionId) {
    this.openPositions.delete(positionId);
  }

  // Calculate liquidation price for an open position
  calculateLiquidationPrice(positionId) {
    // Implementation based on your liquidation calculation rules
    // Retrieve position details from openPositions map and perform the calculation
    // Return the liquidation price
  }

  // Calculate fee for an order
  calculateFee(order) {
    const feeAmount = order.quantity * order.price * this.feePercentage;
    return feeAmount;
  }
}
