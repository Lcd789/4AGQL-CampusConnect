const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const UserSchema = require("../models/User").schema;

const userDb = mongoose.createConnection(process.env.USER_DB_URI);

const UserModel = userDb.model("User", UserSchema);

const authMiddleware = async (req) => {

    // Log tous les headers reçus
    console.log("\n=== GRADE SERVICE REQUEST HEADERS ===");
    console.log(JSON.stringify(req.headers, null, 2));

    // Log spécifique pour le header Authorization
    console.log("\n=== AUTH HEADER DETAILS ===");
    console.log(`Raw Authorization header: "${req.headers.authorization}"`);

    const token = req.headers.authorization?.split("Bearer ")[1];

    console.log(`Extracted token: ${token ? `"${token.substring(0, 15)}..."` : "null"}`);

    if (!token) {
        console.log("No token provided - Authentication failed");
        return null;
    }

    try {
        console.log("\n=== TOKEN VERIFICATION ATTEMPT ===");
        console.log(`JWT Secret available: ${!!process.env.JWT_SECRET}`);
        console.log(`JWT Secret length: ${process.env.JWT_SECRET?.length || 0}`);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("\n=== TOKEN DECODED SUCCESSFULLY ===");
        console.log(`Decoded payload: ${JSON.stringify({
            userId: decoded.userId,
            iat: decoded.iat,
            exp: decoded.exp,
            // Temps restant avant expiration en minutes
            expiresIn: Math.floor((decoded.exp - Date.now()/1000)/60) + " minutes"
        })}`);


        const user = await UserModel.findById(decoded.userId);
        if (user) {
            console.log(`\n=== USER FOUND ===`);
            console.log(`User ID: ${user._id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            return user;
        } else {
            console.log(`\n=== USER NOT FOUND ===`);
            console.log(`User ID from token not found in database: ${decoded.userId}`);
            return null;
        }

    } catch (error) {
        console.log("\n=== TOKEN VERIFICATION ERROR ===");
        console.log(`Error type: ${error.name}`);
        console.log(`Error message: ${error.message}`);
        console.log(`token: ${token ? token.substring(0, 15) + "..." : "null"}`);

        // Vérifiez si l'erreur est due à l'expiration du token
        if (error.name === "TokenExpiredError") {
            try {
                // Décodage sans vérification pour obtenir des informations
                const decodedWithoutVerify = jwt.decode(token);
                if (decodedWithoutVerify) {
                    console.log(`Token expired at: ${new Date(decodedWithoutVerify.exp * 1000).toISOString()}`);
                    console.log(`Current time: ${new Date().toISOString()}`);
                    console.log(`Expired ${Math.floor((Date.now()/1000 - decodedWithoutVerify.exp)/60)} minutes ago`);
                }
            } catch (e) {
                console.log("Could not decode expired token");
            }
        }

        console.log(`process.env.JWT_SECRET first 5 chars: ${process.env.JWT_SECRET?.substring(0, 5) || "undefined"}`);
        return null;

    }
};

module.exports = {authMiddleware};
