const User = require('../models/User');
const ResumeAnalysis = require('../models/ResumeAnalysis');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      users,
      pagination: { current: page, total: Math.ceil(total / limit), count: total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// @desc    Get dashboard reports/stats
// @route   GET /api/admin/reports
// @access  Admin
const getReports = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAnalyses,
      completedAnalyses,
      recentUsers,
      recentAnalyses,
      avgAtsScore
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      ResumeAnalysis.countDocuments(),
      ResumeAnalysis.countDocuments({ status: 'completed' }),
      User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 }).limit(5),
      ResumeAnalysis.find({ status: 'completed' }).populate('user', 'name email').sort({ createdAt: -1 }).limit(10).select('-rawText -analysis.keywords'),
      ResumeAnalysis.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, avg: { $avg: '$atsScore' } } }
      ])
    ]);

    // Monthly analysis stats for chart
    const monthlyStats = await ResumeAnalysis.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$atsScore' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Score distribution
    const scoreDistribution = await ResumeAnalysis.aggregate([
      { $match: { status: 'completed' } },
      {
        $bucket: {
          groupBy: '$atsScore',
          boundaries: [0, 25, 50, 70, 85, 101],
          default: 'Other',
          output: { count: { $sum: 1 }, label: { $first: '$atsScore' } }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAnalyses,
        completedAnalyses,
        avgAtsScore: avgAtsScore[0]?.avg?.toFixed(1) || 0,
        successRate: totalAnalyses > 0 ? ((completedAnalyses / totalAnalyses) * 100).toFixed(1) : 0
      },
      recentUsers,
      recentAnalyses,
      monthlyStats,
      scoreDistribution
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ success: false, message: 'Error fetching reports' });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot deactivate admin accounts' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin accounts' });

    await ResumeAnalysis.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User and their data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

module.exports = { getAllUsers, getReports, toggleUserStatus, deleteUser };
