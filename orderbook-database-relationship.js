// Import the required libraries
const express = require('express');
const { MongoClient } = require('mongodb');
const { body, validationResult } = require('express-validator');

// Create an Express application
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Connect to the MongoDB database
const dbClient = new MongoClient('mongodb://localhost:27017/orders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a route to get the balance of a user
app.get('/balance', async (req, res) => {
  try {
    await dbClient.connect();
    const db = dbClient.db('orders');

    // Find the user in the database
    const user = await db.collection('users').findOne({ publicAddress: req.query.publicAddress });

    // If the user is not found, send a 404 error
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send the user's balance
    res.json({
      balance: user.balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Define a route to deposit cryptocurrency into a user's account
app.post(
  '/deposit',
  [
    body('publicAddress').notEmpty().withMessage('Public address is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
  ],
  async (req, res) => {
    try {
      await dbClient.connect();
      const db = dbClient.db('orders');

      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Find the user in the database
      const user = await db.collection('users').findOne({ publicAddress: req.body.publicAddress });

      // If the user is not found, send a 404 error
      if (!user) {
        return res.status(404).send('User not found');
      }

      // Add the amount to the user's balance
      user.balance += req.body.amount;

      // Save the user's balance
      await db.collection('users').updateOne({ publicAddress: req.body.publicAddress }, { $set: { balance: user.balance } });

      // Send a success message
      res.send('Deposit successful');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Define a route to withdraw cryptocurrency from a user's account
app.post(
  '/withdrawal',
  [
    body('publicAddress').notEmpty().withMessage('Public address is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
  ],
  async (req, res) => {
    try {
      await dbClient.connect();
      const db = dbClient.db('orders');

      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Find the user in the database
      const user = await db.collection('users').findOne({ publicAddress: req.body.publicAddress });

      // If the user is not found, send a 404 error
      if (!user) {
        return res.status(404).send('User not found');
      } else if (user.balance < req.body.amount) {
        return res.status(400).send('Insufficient balance');
      }

      // Subtract the amount from the user's balance
      user.balance -= req.body.amount;

      // Save the user's balance
      await db.collection('users').updateOne({ publicAddress: req.body.publicAddress }, { $set: { balance: user.balance } });

      // Send a success message
      res.send('Withdrawal successful');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Define a route to get the order book
app.get('/orderbook', async (req, res) => {
  try {
    await dbClient.connect();
    const db = dbClient.db('orders');

    // Find all orders in the database
    const orderBook = await db.collection('orderBooks').find().toArray();

    // Send the order book to the client
    res.json(orderBook);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
