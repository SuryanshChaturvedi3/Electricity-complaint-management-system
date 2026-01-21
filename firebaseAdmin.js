require('dotenv').config(); // Load environment variables
const admin = require("firebase-admin");

// Fail fast if any expected env vars are missing so we don't get a cryptic key error later.
const requiredEnv = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing Firebase env vars: ${missing.join(', ')}`);
}

// Handle escaped newlines and accidental wrapping quotes in the private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  .replace(/^"|"$/g, '')
  .replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
});

module.exports = admin;
