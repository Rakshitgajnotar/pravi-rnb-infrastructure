const express = require('express');
const router = express.Router();
const {
  login,
  getUsers,
  getCurrentUser,
  switchRole,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Public authentication routes
router.post('/login', login);
router.get('/users', getUsers);

// Protected routes (require valid session/token)
router.use(authenticate);
router.get('/me', getCurrentUser);
router.post('/switch', switchRole);

module.exports = router;
