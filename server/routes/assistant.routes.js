const express = require('express');
const router = express.Router();
const ensureAuth = require('../middlewares/authMiddleware');
const toolSelector = require('../tools/toolSelector');
const User = require('../models/User')
const {generateActions , generateStrategy, generateInsights, saveChatHistoryManually, websiteAudit} = require('../controllers/assistant.controller')

// @route POST /api/assistant/strategy
router.post('/strategy', ensureAuth, generateStrategy);

// @route POST /api/assistant/actions
router.post('/actions', ensureAuth, generateActions);

router.post('/insights', ensureAuth, generateInsights);

// Save chat history manually from client
router.post('/save', ensureAuth,saveChatHistoryManually);

// Website audit route
router.post("/website-audit", ensureAuth, websiteAudit);


// @route POST /api/assistant/tool
router.post('/tool', ensureAuth, async (req, res) => {
  const { label, onboarding } = req.body;
  
  try {
    const result = await toolSelector(label, onboarding);
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        chatHistory: { role: 'user', content: label }
      }
    });
    
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        chatHistory: { role: 'assistant', content: result }
      },
      updatedAt: new Date()
    });
    res.json({ result });
  } catch (err) {
    console.error(`Tool selection failed [${label}]:`, err.message);
    res.status(500).json({ message: 'Tool response failed.' });
  }
});

module.exports = router;
