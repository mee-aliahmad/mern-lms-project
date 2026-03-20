const mongoose = require('mongoose');

/**
 * Course Schema
 * Courses are created by instructors and can contain multiple lessons.
 */
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'DevOps',
        'Design',
        'Business',
        'Other',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    lessons: [
      {
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        duration: {
          type: String, // e.g., "10 mins"
        },
      },
    ],
    image: {
      type: String,
      default: '',
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
