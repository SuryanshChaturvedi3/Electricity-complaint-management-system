require('dotenv').config(); // Load environment variables
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "surya@123"; // Using environment variable for secret key

/*-------Generate JWT Token-------*/
function generateToken(payload){
   
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' }); // Token valid for 1 day
}


/*-------JWT Authentication Middleware-------*/

const authenticateJWT = (req, res, next) => {
    try {
        const cookieToken = req.cookies?.token;
        const authHeader = req.headers?.authorization;
        const bearerToken = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const token = cookieToken || bearerToken;

        console.log("Token present:", !!token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: token missing" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        return next();
    } catch (error) {
        console.log("Token error", error);
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
};

module.exports = {
    generateToken,
    authenticateJWT
};
