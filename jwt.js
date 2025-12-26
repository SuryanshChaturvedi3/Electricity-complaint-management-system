const jwt = require("jsonwebtoken");
const SECRET_KEY = "surya@123"; // Ideally, use environment variables to store secret keys

/*-------Generate JWT Token-------*/
function generateToken(payload){
   
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' }); // Token valid for 1 day
}


/*-------JWT Authentication Middleware-------*/

const authenticateJWT = (req, res, next) => {
    

    try {
        const token = req.cookies?.token; // Token expected in cookies
        console.log("Token:",token);
        if (!token) {
            return res.redirect('/login'); // Redirect to login if no token
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        return next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.log("Token error", error);
        return res.redirect('/login'); // Redirect to login on error
    }
};

module.exports = {
    generateToken,
    authenticateJWT
};
