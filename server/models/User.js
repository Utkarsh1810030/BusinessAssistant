const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  email: String,
  photo: String,
  onboarded: Boolean,
  onboarding: {
    type: Object,
    default: {}
  },
  chatHistory: [
    {
      role: String,
      content: String
    }
  ],
  insights: {
    summary: String,
    checklist: [String],
    roadmap: [String],
    revenue: {
      quarter: [{ month: String, amount: Number }],
      '6months': [{ month: String, amount: Number }],
      '1year': [{ month: String, amount: Number }],
      '5years': [{ month: String, amount: Number }]
    }
  }
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);