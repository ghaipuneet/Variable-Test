// Backend
const express = require('express');
const app = express();
const web3 = require('web3');

app.get('/', (req, res) => {
  // Get the user's public address
  const publicAddress = web3.eth.accounts[0];

  // Get the user's balance
  const balance = web3.eth.getBalance(publicAddress);

  // Return the user's public address and balance
  res.json({
    publicAddress,
    balance
  });
});

app.listen(3000);
