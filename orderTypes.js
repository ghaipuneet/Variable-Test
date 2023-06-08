// Import necessary modules and dependencies

// Define the Market Order class
class MarketOrder {
  constructor(quantity) {
    this.type = 'market';
    this.quantity = quantity;
  }
}

// Define the Limit Order class
class LimitOrder {
  constructor(price, quantity) {
    this.type = 'limit';
    this.price = price;
    this.quantity = quantity;
  }
}

// Define the Stop Order class
class StopOrder {
  constructor(stopPrice, quantity) {
    this.type = 'stop';
    this.stopPrice = stopPrice;
    this.quantity = quantity;
  }
}

// Define the Stop Limit Order class
class StopLimitOrder {
  constructor(stopPrice, limitPrice, quantity) {
    this.type = 'stop_limit';
    this.stopPrice = stopPrice;
    this.limitPrice = limitPrice;
    this.quantity = quantity;
  }
}

// Define the Take Profit Order class
class TakeProfitOrder {
  constructor(takeProfitPrice, quantity) {
    this.type = 'take_profit';
    this.takeProfitPrice = takeProfitPrice;
    this.quantity = quantity;
  }
}

// Define the fee structure
const OrderFeeStructure = {
  limit: {
    takerFee: 0.0002,   // 0.02% fee for takers
    makerRebate: 0.0001 // 0.01% rebate for makers
  },
  stop_limit: {
    takerFee: 0.0002,   // 0.02% fee for takers
    makerRebate: 0.0001 // 0.01% rebate for makers
  },
  market: {
    takerFee: 0.0002,   // 0.02% fee for takers
    makerRebate: 0.0000 // 0% rebate for makers
  },
  stop: {
    takerFee: 0.0002,   // 0.02% fee for takers
    makerRebate: 0.0000 // 0% rebate for makers
  },
  take_profit: {
    takerFee: 0.0002,   // 0.02% fee for takers
    makerRebate: 0.0000 // 0% rebate for makers
  }
};

// Export the Order Type classes and fee structure
module.exports = {
  MarketOrder,
  LimitOrder,
  StopOrder,
  StopLimitOrder,
  TakeProfitOrder,
  OrderFeeStructure
};
