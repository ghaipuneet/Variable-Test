// UserBalances.js

// Class representing user balances
class UserBalances {
  constructor() {
    this.balances = {};
  }

  // Add or update user balance
  updateBalance(userId, asset, amount) {
    if (!this.balances[userId]) {
      this.balances[userId] = {};
    }
    if (!this.balances[userId][asset]) {
      this.balances[userId][asset] = 0;
    }
    this.balances[userId][asset] += amount;
  }

  // Deduct user balance
  deductBalance(userId, asset, amount) {
    if (!this.balances[userId] || !this.balances[userId][asset]) {
      throw new Error(`Insufficient balance for user ${userId}`);
    }
    if (this.balances[userId][asset] < amount) {
      throw new Error(`Insufficient balance for user ${userId}`);
    }
    this.balances[userId][asset] -= amount;
  }

  // Get user balance
  getBalance(userId, asset) {
    if (!this.balances[userId] || !this.balances[userId][asset]) {
      return 0;
    }
    return this.balances[userId][asset];
  }

  // Check if user has sufficient balance
  hasSufficientBalance(userId, asset, amount) {
    if (!this.balances[userId] || !this.balances[userId][asset]) {
      return false;
    }
    return this.balances[userId][asset] >= amount;
  }
}

// Create an instance of UserBalances
const userBalances = new UserBalances();

// Usage example
const userId = 'user1';
const asset = 'BTC';
const depositAmount = 5;
const orderQuantity = 10; // Replace with the appropriate order quantity

// Deposit funds to user balance
userBalances.updateBalance(userId, asset, depositAmount);

// Get user balance
const balance = userBalances.getBalance(userId, asset);
console.log(`User ${userId} balance for ${asset}: ${balance}`);

// Deduct funds from user balance
if (userBalances.hasSufficientBalance(userId, asset, orderQuantity)) {
  userBalances.deductBalance(userId, asset, orderQuantity);
  console.log(`Withdrawal of ${orderQuantity} ${asset} successful.`);
} else {
  console.log(`Insufficient balance for withdrawal.`);
}

// Get updated user balance
const updatedBalance = userBalances.getBalance(userId, asset);
console.log(`Updated user ${userId} balance for ${asset}: ${updatedBalance}`);
