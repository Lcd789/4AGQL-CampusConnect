const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    enrolledAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
