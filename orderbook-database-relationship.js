// Import the express library
const express = require('express')

// Import the MongoClient library
const MongoClient = require('mongodb').MongoClient

// Create an Express application
const app = express()

// Define a route to get the balance of a user
app.get('/balance', (req, res) => {
  // Connect to the MongoDB database
  const db = MongoClient.connect('mongodb://localhost:27017/orders', (err, client) => {
    if (err) {
      // Throw an error if the connection fails
      throw err
    }

    // Get the database object
    const db = client.db('orders')

    // Find the user in the database
    const user = db.users.findOne({publicAddress: req.query.publicAddress})

    // If the user is not found, send a 404 error
    if (!user) {
      res.status(404).send('User not found')
    } else {
      // Send the user's balance
      res.json({
        balance: user.balance
      })
    }
  })
})

// Define a route to deposit cryptocurrency into a user's account
app.post('/deposit', (req, res) => {
  // Connect to the MongoDB database
  const db = MongoClient.connect('mongodb://localhost:27017/orders', (err, client) => {
    if (err) {
      // Throw an error if the connection fails
      throw err
    }

    // Get the database object
    const db = client.db('orders')

    // Find the user in the database
    const user = db.users.findOne({publicAddress: req.body.publicAddress})

    // If the user is not found, send a 404 error
    if (!user) {
      res.status(404).send('User not found')
    } else {
      // Add the amount to the user's balance
      user.balance += req.body.amount

      // Save the user's balance
      db.users.save(user)

      // Send a success message
      res.send('Deposit successful')
    }
  })
})

// Define a route to withdraw cryptocurrency from a user's account
app.post('/withdrawal', (req, res) => {
  // Connect to the MongoDB database
  const db = MongoClient.connect('mongodb://localhost:27017/orders', (err, client) => {
    if (err) {
      // Throw an error if the connection fails
      throw err
    }

    // Get the database object
    const db = client.db('orders')

    // Find the user in the database
    const user = db.users.findOne({publicAddress: req.body.publicAddress})

    // If the user is not found, send a 404 error
    if (!user) {
      res.status(404).send('User not found')
    } else if (user.balance < req.body.amount) {
      res.status(400).send('Insufficient balance')
    } else {
      // Subtract the amount from the user's balance
      user.balance -= req.body.amount

      // Save the user's balance
      db.users.save(user)

      // Send a success message
      res.send('Withdrawal successful')
    }
  })
})

// Define a route to get the order book
app.get('/orderbook', (req, res) => {
  // Connect to the MongoDB database
  const db = MongoClient.connect('mongodb://localhost:27017/orders', (err, client) => {
    if (err) {
      // Throw an error if the connection fails
      throw err
    }

    // Get the database object
    const db = client.db('orders')

    // Find all orders in the database
    const orderBook = db.orderBooks.find()

    // Send the order book to the client
    res.json(orderBook)
  })
})
