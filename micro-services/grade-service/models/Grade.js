// models/Grade.js
const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0,
        max: 20 // Échelle française
    },
    comment: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Grade', GradeSchema);