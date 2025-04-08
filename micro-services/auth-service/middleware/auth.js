const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await User.findById(decoded.userId);
        return user;
    } catch (error) {
        return null;
    }
};

module.exports = { authMiddleware };
