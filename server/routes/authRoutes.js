const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, verifyMasterPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  next();
};

router.post(
  '/register',
  [body('email').isEmail().normalizeEmail(), body('masterPassword').isLength({ min: 8 })],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('masterPassword').notEmpty()],
  validate,
  login
);

router.post('/verify-master', protect, verifyMasterPassword);
router.get('/me', protect, getMe);

module.exports = router;
