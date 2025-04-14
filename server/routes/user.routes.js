const express = require('express');
const router = express.Router();
const BusinessProfile = require('../models/BusinessProfile');
const ensureAuth = require('../middlewares/authMiddleware');

// TODO
// GET /api/user/business-profile
// router.get('/business-profile', ensureAuth, async (req, res) => {
//   try {
//     const profile = await BusinessProfile.findOne({ userId: req.user._id });
//     res.json(profile || {});
//   } catch (err) {
//     console.error('❌ Failed to fetch full business profile:', err);
//     res.status(500).json({ message: 'Failed to fetch business profile' });
//   }
// });

// GET /api/user/site-summary
router.get('/site-summary', ensureAuth, async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user._id });
    res.json(profile?.siteSummary || {});
  } catch (err) {
    console.error('❌ Failed to load site summary:', err);
    res.status(500).json({ message: 'Failed to load summary' });
  }
});

// POST /api/user/save-site-summary
router.post('/save-site-summary', ensureAuth, async (req, res) => {
  try {
    const { features, testimonials, banner, impact } = req.body;
    const update = {
      userId: req.user._id,
      siteSummary: { features, testimonials, banner, impact }
    };
    await BusinessProfile.findOneAndUpdate(
      { userId: req.user._id },
      update,
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to save site summary:', err);
    res.status(500).json({ message: 'Failed to save summary' });
  }
});

// GET /api/user/site-preview
router.get('/site-preview', ensureAuth, async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user._id });
    res.json({ iframeHtml: profile?.iframeHtml || '' });
  } catch (err) {
    console.error('❌ Failed to load site preview:', err);
    res.status(500).json({ message: 'Failed to load preview' });
  }
});

// POST /api/user/save-site-preview
router.post('/save-site-preview', ensureAuth, async (req, res) => {
  try {
    const { iframeHtml } = req.body;
    const update = { userId: req.user._id, iframeHtml };
    await BusinessProfile.findOneAndUpdate(
      { userId: req.user._id },
      update,
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to save site preview:', err);
    res.status(500).json({ message: 'Failed to save preview' });
  }
});

module.exports = router;