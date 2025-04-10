const mongoose = require('mongoose');

const ClassEnrollmentSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        default: 'active'
    }
});

// Ensure a student can only be enrolled once in a class
ClassEnrollmentSchema.index({ class: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('ClassEnrollment', ClassEnrollmentSchema);