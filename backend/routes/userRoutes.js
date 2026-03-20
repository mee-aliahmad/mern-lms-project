const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAnalytics,
} = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// All user management routes require admin access
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/analytics', getAnalytics);
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;
