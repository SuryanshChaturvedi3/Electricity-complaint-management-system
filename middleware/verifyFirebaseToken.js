module.exports = verifyFirebaseToken;

const admin = require("../firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 4️⃣ Attach user to request
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired Firebase token",
    });
  }
};

module.exports = verifyFirebaseToken;

