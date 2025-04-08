const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    professorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("Class", ClassSchema);
