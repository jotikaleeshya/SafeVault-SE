const express = require('express');
const router = express.Router();
const {
  getEntries,
  getEntry,
  revealEntry,
  createEntry,
  updateEntry,
  deleteEntry,
  getSecurityAnalysis,
} = require('../controllers/vaultController');
const { protect } = require('../middleware/authMiddleware');

// All vault routes require authentication
router.use(protect);

router.route('/').get(getEntries).post(createEntry);
router.get('/security', getSecurityAnalysis);
router.route('/:id').get(getEntry).put(updateEntry).delete(deleteEntry);
router.post('/:id/reveal', revealEntry);

module.exports = router;
