const Course = require('../models/Course');

/**
 * @desc    Get all courses (with optional search/filter)
 * @route   GET /api/courses
 * @access  Public
 */
const getAllCourses = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name email'
    );

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private (Instructor/Admin)
 */
const createCourse = async (req, res, next) => {
  try {
    // Set the instructor to the logged-in user
    req.body.instructor = req.user._id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a course
 * @route   PUT /api/courses/:id
 * @access  Private (Instructor who owns it / Admin)
 */
const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Only the course instructor or an admin can update
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this course');
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/courses/:id
 * @access  Private (Instructor who owns it / Admin)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Only the course instructor or an admin can delete
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this course');
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
