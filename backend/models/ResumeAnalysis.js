const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  analysis: {
    skills: {
      found: [String],
      missing: [String]
    },
    strengths: [String],
    weaknesses: [String],
    education: {
      summary: String,
      details: [String],
      score: Number
    },
    experience: {
      summary: String,
      details: [String],
      yearsOfExperience: Number,
      score: Number
    },
    projects: {
      summary: String,
      details: [String],
      count: Number,
      score: Number
    },
    keywords: {
      found: [String],
      missing: [String],
      density: Number
    },
    suggestions: [String],
    overallFeedback: String
  },
  jobDescriptionMatch: {
    jobTitle: String,
    jobDescription: String,
    matchPercentage: Number,
    matchedSkills: [String],
    missingSkills: [String],
    suggestions: [String],
    analyzedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
