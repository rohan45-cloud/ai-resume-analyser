import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiUpload, FiClock, FiTrendingUp, FiFileText, FiArrowRight, FiZap } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import ScoreCircle from '../components/common/ScoreCircle';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
      <Icon className={`text-xl ${color}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/resume/history?limit=5');
        setHistory(res.data.analyses || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  const avgScore = history.length
    ? Math.round(history.reduce((sum, a) => sum + a.atsScore, 0) / history.length)
    : 0;

  const bestScore = history.length ? Math.max(...history.map(a => a.atsScore)) : 0;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good to see you, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Ready to optimize your resume and land more interviews?</p>
          </div>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto">
            <FiUpload className="text-sm" /> Analyze New Resume
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiFileText} label="Total Analyses" value={user?.totalAnalyses || 0} color="text-blue-600" bg="bg-blue-50" />
          <StatCard icon={FiTrendingUp} label="Best ATS Score" value={bestScore || '—'} color="text-green-600" bg="bg-green-50" />
          <StatCard icon={FiZap} label="Avg ATS Score" value={avgScore || '—'} color="text-indigo-600" bg="bg-indigo-50" />
          <StatCard icon={FiClock} label="Last Analysis" value={history.length ? 'Recent' : 'None yet'} color="text-gray-600" bg="bg-gray-100" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <Link to="/upload" className="card flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiUpload className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Upload Resume</p>
                <p className="text-xs text-gray-500 mt-0.5">PDF or DOCX format</p>
              </div>
              <FiArrowRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/history" className="card flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiClock className="text-indigo-600 text-lg" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">View History</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.totalAnalyses || 0} analyses</p>
              </div>
              <FiArrowRight className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </Link>

            {/* AI tips */}
            <div className="card bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
              <div className="flex items-center gap-2 mb-3">
                <MdAutoAwesome className="text-yellow-300 text-lg" />
                <span className="font-semibold text-sm">Quick Tips</span>
              </div>
              <ul className="text-sm text-blue-100 space-y-2">
                <li className="flex gap-2"><span className="text-yellow-300 shrink-0">•</span> Use keywords from the job description</li>
                <li className="flex gap-2"><span className="text-yellow-300 shrink-0">•</span> Quantify achievements with numbers</li>
                <li className="flex gap-2"><span className="text-yellow-300 shrink-0">•</span> Keep resume to 1-2 pages max</li>
                <li className="flex gap-2"><span className="text-yellow-300 shrink-0">•</span> Use standard section headings</li>
              </ul>
            </div>
          </div>

          {/* Recent analyses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Analyses</h2>
              {history.length > 0 && (
                <Link to="/history" className="text-sm text-blue-600 font-medium hover:underline">View all</Link>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl shimmer" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 shimmer rounded" />
                        <div className="h-3 w-24 shimmer rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="card flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200">
                <FiFileText className="text-4xl text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">No analyses yet</h3>
                <p className="text-sm text-gray-500 mb-4">Upload your first resume to get started</p>
                <Link to="/upload" className="btn-primary text-sm py-2 px-5">Upload Resume</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(analysis => (
                  <Link
                    key={analysis._id}
                    to={`/results/${analysis._id}`}
                    className="card flex items-center gap-4 hover:shadow-md hover:border-blue-100 transition-all group border border-gray-100"
                  >
                    <ScoreCircle score={analysis.atsScore} size={56} strokeWidth={5} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{analysis.fileName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getScoreColor(analysis.atsScore)}`}>
                          ATS: {analysis.atsScore}/100
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(analysis.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <FiArrowRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
