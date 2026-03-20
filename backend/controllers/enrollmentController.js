const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

/**
 * @desc    Enroll in a course
 * @route   POST /api/enroll
 * @access  Private (Student)
 */
const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Prevent instructors from enrolling in their own course
    if (course.instructor.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot enroll in your own course');
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      res.status(400);
      throw new Error('You are already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    // Increment enrollment count on course
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 },
    });

    res.status(201).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all courses the logged-in user is enrolled in
 * @route   GET /api/enroll/my-courses
 * @access  Private
 */
const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name email' },
      })
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update enrollment progress
 * @route   PUT /api/enroll/:id
 * @access  Private
 */
const updateProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!enrollment) {
      res.status(404);
      throw new Error('Enrollment not found');
    }

    enrollment.progress = progress;
    await enrollment.save();

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { enrollInCourse, getMyCourses, updateProgress };
