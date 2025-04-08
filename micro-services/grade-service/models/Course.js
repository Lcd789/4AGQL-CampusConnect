const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    professorId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("Course", CourseSchema);
