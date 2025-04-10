// models/Enrollment.js
const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
});

// Index pour optimiser les recherches et assurer l'unicité
EnrollmentSchema.index({ classId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);