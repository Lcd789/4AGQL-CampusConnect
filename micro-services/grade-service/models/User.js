// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    pseudo: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "professor"], default: "student" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);