const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrolledAt: { type: Date, default: Date.now }
});

// Index composé pour s'assurer qu'un étudiant ne peut s'inscrire qu'une fois à un cours
EnrollmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", EnrollmentSchema);