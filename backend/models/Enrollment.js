const mongoose = require('mongoose');

/**
 * Enrollment Schema
 * Tracks which students are enrolled in which courses and their progress.
 * Compound index ensures a student can only enroll once per course.
 */
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
