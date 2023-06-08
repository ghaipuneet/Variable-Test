// Define a helper function to sort orders based on price and quantity priority
function sortOrders(orders) {
  // Sort orders based on price priority
  orders.sort((a, b) => {
    const priorityOrder = ['stop', 'market', 'take_profit', 'limit', 'stop_limit'];
    return priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type);
  });

  // Sort orders within the same price level based on quantity priority
  orders.sort((a, b) => b.quantity - a.quantity);

  // Sort orders within the same price and quantity level based on FIFO
  orders.sort((a, b) => a.timestamp - b.timestamp);

  return orders;
}

// Export the sortOrders function
module.exports = sortOrders;
