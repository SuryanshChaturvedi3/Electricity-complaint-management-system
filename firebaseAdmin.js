const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

const loadServiceAccount = () => {
  // 1. Check if the full JSON string is in Environment Variables
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    // 🔥 CRITICAL: Fix for private key newlines on Render
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
    return credentials;
  }

  // 2. Local fallback (for your computer)
  const defaultPath = path.join(__dirname, "config", "firebaseServiceAccount.json");
  if (fs.existsSync(defaultPath)) {
    return JSON.parse(fs.readFileSync(defaultPath, "utf8"));
  }

  throw new Error("Firebase service account not configured. Please add FIREBASE_SERVICE_ACCOUNT in Render Env variables.");
};

try {
  const serviceAccount = loadServiceAccount();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin SDK Initialized Successfully");
  }
} catch (error) {
  console.error("❌ Firebase Initialization Error:", error.message);
  // Hum process exit nahi kar rahe taaki server crash na ho, 
  // par dhyan rahe ki firebase calls fail honge.
}

module.exports = admin;