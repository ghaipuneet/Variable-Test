const OrderBook = (() => {
  const orderBook = {};

  orderBook.addOrder = (order) => {
    if (!orderBook[order.symbol]) {
      orderBook[order.symbol] = {
        bids: [],
        asks: []
      };
    }

    const side = order.side === "buy" ? "bids" : "asks";
    orderBook[order.symbol][side].push(order);

    orderBook.sort();
  };

  orderBook.removeOrder = (order) => {
    const side = order.side === "buy" ? "bids" : "asks";
    const orders = orderBook[order.symbol][side];

    orders.forEach((o, i) => {
      if (o.id === order.id) {
        orders.splice(i, 1);
        break;
      }
    });

    if (orders.length === 0) {
      delete orderBook[order.symbol][side];
    }

    orderBook.sort();
  };

  orderBook.getBestBid = (symbol) => {
    return orderBook[symbol].bids[0];
  };

  orderBook.getBestAsk = (symbol) => {
    return orderBook[symbol].asks[0];
  };

  orderBook.getOrders = (symbol) => {
    return orderBook[symbol];
  };

  orderBook.sort = () => {
    Object.keys(orderBook).forEach((symbol) => {
      orderBook[symbol].bids.sort((a, b) => a.price - b.price);
      orderBook[symbol].asks.sort((a, b) => b.price - a.price);
    });
  };

  orderBook.handleMarketOrder = (symbol, amount) => {
    const bestBid = orderBook.getBestBid(symbol);
    if (bestBid) {
      const filledAmount = Math.min(amount, bestBid.size);
      orderBook.removeOrder(bestBid);
      return filledAmount;
    } else {
      return 0;
    }
  };

  orderBook.handleStopLossOrder = (symbol, price, amount) => {
    const orders = orderBook.getOrders(symbol);
    for (const order of orders) {
      if (order.side === "sell" && order.price <= price) {
        const filledAmount = Math.min(amount, order.size);
        orderBook.removeOrder(order);
        return filledAmount;
      }
    }
    return 0;
  };

  orderBook.handleStopLimitOrder = (symbol, price, stopPrice, amount) => {
    const orders = orderBook.getOrders(symbol);
    for (const order of orders) {
      if (order.side === "sell" && order.price <= price && order.price >= stopPrice) {
        const filledAmount = Math.min(amount, order.size);
        orderBook.removeOrder(order);
        return filledAmount;
      }
    }
    return 0;
  };

  orderBook.handleTakeProfitOrder = (symbol, price, amount) => {
    const orders = orderBook.getOrders(symbol);
    for (const order of orders) {
      if (order.side === "buy" && order.price >= price) {
        const filledAmount = Math.min(amount, order.size);
        orderBook.removeOrder(order);
        return filledAmount;
      }
    }
    return 0;
  };

  return orderBook;
})();
