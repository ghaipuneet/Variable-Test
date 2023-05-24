import web3 from "web3";
import Multichain from "multichain";

const multichain = new Multichain();

async function deposit(chain, amount) {
  // Get the user's public address on the target chain.
  const publicAddress = await multichain.getAddress(chain);

  // Create a transaction to deposit funds to the user's address on the target chain.
  const transaction = await multichain.deposit(chain, publicAddress, amount);

  // Wait for the transaction to be mined.
  await transaction.wait();

  // Return the transaction hash.
  return transaction.hash;
}

async function withdraw(chain, amount) {
  // Get the user's public address on the source chain.
  const publicAddress = await multichain.getAddress(chain);

  // Create a transaction to withdraw funds from the user's address on the source chain.
  const transaction = await multichain.withdraw(chain, publicAddress, amount);

  // Wait for the transaction to be mined.
  await transaction.wait();

  // Return the transaction hash.
  return transaction.hash;
}

export { deposit, withdraw };
