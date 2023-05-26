const OrderMatchingEngine = require('./order-matching-engine');

const engine = new OrderMatchingEngine();

// Add an order.
engine.addOrder({
  id: 1,
  side: 'buy',
  price: 100,
  quantity: 10
});

// Remove an order.
engine.removeOrder(1);

// Match orders.
engine.matchOrders();
