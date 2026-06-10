const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  next();
};
const { register, login, verifyMasterPassword, getMe, updateSettings, trustDevice, verifyDevice, removeDevice } = require('../controllers/authController');

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address.'), 
    body('masterPassword').isLength({ min: 8 }).withMessage('Master password must be at least 8 characters.')
  ],
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
router.patch('/settings', protect, updateSettings);
router.post('/trust-device', protect, trustDevice);
router.post('/verify-device', verifyDevice);
router.post('/remove-device', protect, removeDevice);

module.exports = router;
