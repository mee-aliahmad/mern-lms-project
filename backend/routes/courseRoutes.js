const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes (Instructor & Admin only)
router.post('/', authMiddleware, roleMiddleware('instructor', 'admin'), createCourse);
router.put('/:id', authMiddleware, roleMiddleware('instructor', 'admin'), updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware('instructor', 'admin'), deleteCourse);

module.exports = router;
