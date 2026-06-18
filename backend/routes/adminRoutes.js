const express = require('express');
const router = express.Router();
const { getAllUsers, getReports, toggleUserStatus, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/reports', getReports);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
