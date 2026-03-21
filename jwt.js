require('dotenv').config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "surya@123";

/*-------Generate JWT Token-------*/
function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

/*-------JWT Authentication Middleware-------*/
const authenticateJWT = (req, res, next) => {
    try {
        const cookieToken = req.cookies?.token;

        const authHeader = req.headers?.authorization;
        const bearerToken = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        const tokens = [bearerToken, cookieToken].filter(Boolean);

        if (tokens.length === 0) {
            return res.status(401).json({ message: "Unauthorized: token missing" });
        }

        let decoded = null;
        for (const token of tokens) {
            try {
                decoded = jwt.verify(token, SECRET_KEY);
                break;
            } catch (verifyError) {
                // Try next token source.
            }
        }

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: invalid token" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token error:", error.message);
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
};

module.exports = {
    generateToken,
    authenticateJWT
};