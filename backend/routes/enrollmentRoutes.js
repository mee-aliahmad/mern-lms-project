const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  updateProgress,
} = require('../controllers/enrollmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All enrollment routes require authentication
router.use(authMiddleware);

router.post('/', enrollInCourse);
router.get('/my-courses', getMyCourses);
router.put('/:id', updateProgress);

module.exports = router;
