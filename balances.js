// Create a connection to the database
const client = new MongoClient("mongodb://localhost:27017");

// Get the database
const db = client.db("mydb");

// Create a collection
const collection = db.collection("balances");

// Create the schema
collection.createIndex([("wallet_address", 1)]);

// Insert some documents
collection.insertMany([
  {
    "wallet_address": "0x1234567890abcdef",
    "currency": "ETH",
    "balance": 100,
    "open_positions": [],
    "closed_positions": []
  },
  {
    "wallet_address": "0xdeadbeefcafedead",
    "currency": "BTC",
    "balance": 50,
    "open_positions": [],
    "closed_positions": []
  },
  {
    "wallet_address": "0xdeadbeefcafedead",
    "currency": "USDC",
    "balance": 100,
    "open_positions": [],
    "closed_positions": []
  },
  {
    "wallet_address": "0xdeadbeefcafedead",
    "currency": "USDT",
    "balance": 50,
    "open_positions": [],
    "closed_positions": []
  },
  {
    "wallet_address": "0xdeadbeefcafedead",
    "currency": "MATIC",
    "balance": 100,
    "open_positions": [],
    "closed_positions": []
  },
  {
    "wallet_address": "0xdeadbeefcafedead",
    "currency": "SOL",
    "balance": 50,
    "open_positions": [],
    "closed_positions": []
  }
]);

// Update the balance
collection.updateOne({
  "wallet_address": "0x1234567890abcdef",
  "currency": "ETH"
}, {
  "$inc": {
    "balance": 10
  }
});

// Query the balance
const balance = await collection.findOne({
  "wallet_address": "0x1234567890abcdef"
});

// Print the balance
console.log(balance.balance);
