// models/BusinessProfile.js
const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  iframeHtml: {
    type: String,
    default: ''
  },
  siteSummary: {
    features: [String],
    testimonials: [String],
    banner: String,
    impact: String
  }
}, { timestamps: true });

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);
