const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own account');
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get platform analytics
 * @route   GET /api/users/analytics
 * @access  Private (Admin only)
 */
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Top courses by enrollment
    const topCourses = await Course.find()
      .sort({ enrollmentCount: -1 })
      .limit(5)
      .populate('instructor', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        recentUsers,
        topCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, deleteUser, getAnalytics };
