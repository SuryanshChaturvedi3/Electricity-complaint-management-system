const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

const loadServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const envPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (!fs.existsSync(envPath)) {
      throw new Error(`Service account file not found at ${envPath}`);
    }
    return JSON.parse(fs.readFileSync(envPath, "utf8"));
  }

  const defaultPath = path.join(__dirname, "config", "firebaseServiceAccount.json");
  if (fs.existsSync(defaultPath)) {
    return JSON.parse(fs.readFileSync(defaultPath, "utf8"));
  }

  throw new Error("Firebase service account not configured");
};

const serviceAccount = loadServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
