const express = require('express');
const router = express.Router();
const {
  uploadResume,
  analyzeResume,
  matchJobDescription,
  getHistory,
  getAnalysis,
  deleteAnalysis
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/analyze', protect, analyzeResume);
router.post('/match-jd', protect, matchJobDescription);
router.get('/history', protect, getHistory);
router.get('/analysis/:id', protect, getAnalysis);
router.delete('/analysis/:id', protect, deleteAnalysis);

module.exports = router;
