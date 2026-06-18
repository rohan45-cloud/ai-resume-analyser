const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');
const { extractTextFromFile, getFileType, deleteFile } = require('../utils/fileExtractor');
const { analyzeResumeWithAI, matchJobDescriptionWithAI } = require('../utils/aiService');
const path = require('path');

// @desc    Upload and analyze resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file (PDF or DOCX)' });
    }

    const filePath = req.file.path;
    const fileType = getFileType(req.file.originalname);
    
    // Extract text from file
    let rawText;
    try {
      rawText = await extractTextFromFile(filePath, fileType);
    } catch (extractError) {
      deleteFile(filePath);
      return res.status(400).json({ success: false, message: extractError.message });
    }

    if (rawText.length < 100) {
      deleteFile(filePath);
      return res.status(400).json({ success: false, message: 'Resume appears to be empty or too short. Please upload a complete resume.' });
    }

    // Create initial record
    const analysis = await ResumeAnalysis.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      rawText,
      status: 'processing'
    });

    // Clean up uploaded file (we have the text now)
    deleteFile(filePath);

    res.json({
      success: true,
      message: 'Resume uploaded successfully. Ready for analysis.',
      analysisId: analysis._id,
      fileName: req.file.originalname,
      fileType,
      textLength: rawText.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file) deleteFile(req.file.path);
    res.status(500).json({ success: false, message: 'Error processing resume. Please try again.' });
  }
};

// @desc    Analyze resume with AI
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const { analysisId } = req.body;

    if (!analysisId) {
      return res.status(400).json({ success: false, message: 'Analysis ID is required' });
    }

    const resumeRecord = await ResumeAnalysis.findOne({ _id: analysisId, user: req.user.id });
    if (!resumeRecord) {
      return res.status(404).json({ success: false, message: 'Resume record not found' });
    }

    if (resumeRecord.status === 'completed' && resumeRecord.atsScore > 0) {
      return res.json({
        success: true,
        message: 'Analysis already completed',
        analysis: resumeRecord
      });
    }

    // Perform AI analysis
    let aiResult;
    try {
      aiResult = await analyzeResumeWithAI(resumeRecord.rawText);
    } catch (aiError) {
      await ResumeAnalysis.findByIdAndUpdate(analysisId, { status: 'failed' });
      return res.status(500).json({ success: false, message: aiError.message });
    }

    // Update analysis record
    const updatedAnalysis = await ResumeAnalysis.findByIdAndUpdate(
      analysisId,
      {
        atsScore: aiResult.atsScore || 0,
        analysis: {
          skills: aiResult.skills || { found: [], missing: [] },
          strengths: aiResult.strengths || [],
          weaknesses: aiResult.weaknesses || [],
          education: aiResult.education || {},
          experience: aiResult.experience || {},
          projects: aiResult.projects || {},
          keywords: aiResult.keywords || { found: [], missing: [], density: 0 },
          suggestions: aiResult.suggestions || [],
          overallFeedback: aiResult.overallFeedback || ''
        },
        status: 'completed'
      },
      { new: true }
    );

    // Increment user's total analyses
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalAnalyses: 1 } });

    res.json({
      success: true,
      message: 'Resume analyzed successfully!',
      analysis: updatedAnalysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, message: 'Analysis failed. Please try again.' });
  }
};

// @desc    Match resume with job description
// @route   POST /api/resume/match-jd
// @access  Private
const matchJobDescription = async (req, res) => {
  try {
    const { analysisId, jobTitle, jobDescription } = req.body;

    if (!analysisId || !jobDescription || !jobTitle) {
      return res.status(400).json({ success: false, message: 'Analysis ID, job title, and job description are required' });
    }

    if (jobDescription.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Job description is too short. Please provide a detailed JD.' });
    }

    const resumeRecord = await ResumeAnalysis.findOne({ _id: analysisId, user: req.user.id });
    if (!resumeRecord) {
      return res.status(404).json({ success: false, message: 'Resume record not found' });
    }

    // Perform JD matching
    let matchResult;
    try {
      matchResult = await matchJobDescriptionWithAI(resumeRecord.rawText, jobDescription, jobTitle);
    } catch (aiError) {
      return res.status(500).json({ success: false, message: aiError.message });
    }

    // Update record with JD match
    const updatedAnalysis = await ResumeAnalysis.findByIdAndUpdate(
      analysisId,
      {
        jobDescriptionMatch: {
          jobTitle,
          jobDescription,
          matchPercentage: matchResult.matchPercentage || 0,
          matchedSkills: matchResult.matchedSkills || [],
          missingSkills: matchResult.missingSkills || [],
          suggestions: matchResult.suggestions || [],
          analyzedAt: new Date()
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Job description matching completed!',
      matchResult: updatedAnalysis.jobDescriptionMatch,
      analysisId: updatedAnalysis._id
    });
  } catch (error) {
    console.error('JD Match error:', error);
    res.status(500).json({ success: false, message: 'Job description matching failed. Please try again.' });
  }
};

// @desc    Get analysis history
// @route   GET /api/resume/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      ResumeAnalysis.find({ user: req.user.id, status: 'completed' })
        .select('-rawText -analysis.keywords.found')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ResumeAnalysis.countDocuments({ user: req.user.id, status: 'completed' })
    ]);

    res.json({
      success: true,
      analyses,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
};

// @desc    Get single analysis
// @route   GET /api/resume/analysis/:id
// @access  Private
const getAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, user: req.user.id });
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analysis' });
  }
};

// @desc    Delete analysis
// @route   DELETE /api/resume/analysis/:id
// @access  Private
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalAnalyses: -1 } });
    res.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting analysis' });
  }
};

module.exports = { uploadResume, analyzeResume, matchJobDescription, getHistory, getAnalysis, deleteAnalysis };
