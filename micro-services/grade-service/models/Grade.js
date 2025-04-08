const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    value: { type: Number, required: true, min: 0, max: 100 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Grade", GradeSchema);
