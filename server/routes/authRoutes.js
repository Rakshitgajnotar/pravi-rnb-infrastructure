const express = require('express');
const router = express.Router();
const { getUsers, getCurrentUser, switchRole } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/users', getUsers);
router.get('/me', getCurrentUser);
router.post('/switch', switchRole);

module.exports = router;
