const crypto = require("crypto");

function generateEncryptionKey() {
  // Generate a random encryption key.
  const keyLength = 128;
  const key = crypto.randomBytes(keyLength).toString("hex");
  return key;
}

function encryptPublicAddress(publicAddress, encryptionKey) {
  // Encrypt a public address using an encryption key.
  const cipher = crypto.createCipher("AES-256-CBC", encryptionKey);
  const encryptedPublicAddress = cipher.update(publicAddress, "utf8", "base64");
  encryptedPublicAddress += cipher.final("base64");
  return encryptedPublicAddress;
}

function decryptPublicAddress(encryptedPublicAddress, encryptionKey) {
  // Decrypt a public address using an encryption key.
  const cipher = crypto.createDecipher("AES-256-CBC", encryptionKey);
  const decryptedPublicAddress = cipher.update(encryptedPublicAddress, "base64", "utf8");
  decryptedPublicAddress += cipher.final("utf8");
  return decryptedPublicAddress;
}

function main() {
  // Encrypt and decrypt a public address.
  const publicAddress = "0x1234567890abcdef";
  const encryptionKey = generateEncryptionKey();
  const encryptedPublicAddress = encryptPublicAddress(publicAddress, encryptionKey);
  const decryptedPublicAddress = decryptPublicAddress(encryptedPublicAddress, encryptionKey);

  console.log("Public address:", publicAddress);
  console.log("Encrypted public address:", encryptedPublicAddress);
  console.log("Decrypted public address:", decryptedPublicAddress);
}

if (require.main === module) {
  main();
}
