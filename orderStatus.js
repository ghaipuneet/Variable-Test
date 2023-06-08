// Define the OrderStatus class
class OrderStatus {
  constructor() {
    this.status = 'Pending';
    this.timestamp = null;
  }

  // Update order status to Open
  markOpen() {
    this.status = 'Open';
    this.timestamp = new Date();
  }

  // Update order status to Partially Filled
  markPartiallyFilled() {
    this.status = 'Partially Filled';
    this.timestamp = new Date();
  }

  // Update order status to Filled
  markFilled() {
    this.status = 'Filled';
    this.timestamp = new Date();
  }

  // Update order status to Cancelled
  markCancelled() {
    this.status = 'Cancelled';
    this.timestamp = new Date();
  }

  // Update order status to Modified
  markModified() {
    this.status = 'Modified';
    this.timestamp = new Date();
  }
}

// Export the OrderStatus class
module.exports = OrderStatus;
