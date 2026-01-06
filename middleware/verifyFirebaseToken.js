const admin = require("../firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyFirebaseToken;
