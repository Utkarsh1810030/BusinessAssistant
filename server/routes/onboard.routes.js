const express = require('express');
const router = express.Router();
const ensureAuth = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.post('/onboard', ensureAuth, async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        onboarding: req.body,       // ✅ Save full form
        onboarded: true             // ✅ Mark user as onboarded
      });
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Onboarding error:', err);
      res.status(500).json({ success: false, message: 'Failed to save onboarding info' });
    }
  });
  

module.exports = router;
