// Import necessary modules and dependencies

// Function to handle partial filling of an order
function partialFillOrder(order, filledQuantity) {
  // Check if the filled quantity is valid
  if (filledQuantity <= 0) {
    throw new Error('Invalid filled quantity');
  }

  // Calculate the remaining quantity of the order
  const remainingQuantity = order.quantity - filledQuantity;

  // Update the order's filled quantity and remaining quantity
  order.filledQuantity = filledQuantity;
  order.remainingQuantity = remainingQuantity;

  // Update the order's status based on the remaining quantity
  if (remainingQuantity > 0) {
    order.status = 'Partially Filled';
  } else {
    order.status = 'Filled';
  }

  // Return the updated order
  return order;
}

// Export the partialFillOrder function
module.exports = partialFillOrder;
