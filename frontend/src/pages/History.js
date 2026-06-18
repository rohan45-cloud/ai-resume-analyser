import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiEye, FiTarget, FiUpload, FiFileText } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ScoreCircle from '../components/common/ScoreCircle';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchHistory = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/resume/history?page=${p}&limit=10`);
      setAnalyses(res.data.analyses || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHistory(page); }, [page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete analysis for "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/resume/analysis/${id}`);
      setAnalyses(prev => prev.filter(a => a._id !== id));
      toast.success('Analysis deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const getScoreStyle = (score) => {
    if (score >= 85) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent' };
    if (score >= 70) return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good' };
    if (score >= 50) return { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Average' };
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Poor' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
            <p className="text-gray-500 text-sm mt-1">All your resume analyses</p>
          </div>
          <Link to="/upload" className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
            <FiUpload /> New Analysis
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading history..." /></div>
        ) : analyses.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200">
            <FiFileText className="text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No analysis history yet</h3>
            <p className="text-gray-500 mb-6">Start by uploading your resume to get your first ATS score</p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <FiUpload /> Upload Your Resume
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {analyses.map(analysis => {
                const style = getScoreStyle(analysis.atsScore);
                return (
                  <div key={analysis._id} className="card flex items-center gap-4 hover:shadow-md transition-shadow">
                    <ScoreCircle score={analysis.atsScore} size={60} strokeWidth={5} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{analysis.fileName}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>
                              {style.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(analysis.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {analysis.jobDescriptionMatch?.matchPercentage > 0 && (
                              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-medium">
                                JD: {analysis.jobDescriptionMatch.matchPercentage}% match
                              </span>
                            )}
                          </div>
                          {analysis.analysis?.skills?.found?.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {analysis.analysis.skills.found.slice(0, 5).map(s => (
                                <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>
                              ))}
                              {analysis.analysis.skills.found.length > 5 && (
                                <span className="text-xs text-gray-400">+{analysis.analysis.skills.found.length - 5} more</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to={`/results/${analysis._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Analysis"
                          >
                            <FiEye />
                          </Link>
                          <Link
                            to={`/job-match/${analysis._id}`}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Match with JD"
                          >
                            <FiTarget />
                          </Link>
                          <button
                            onClick={() => handleDelete(analysis._id, analysis.fileName)}
                            disabled={deleting === analysis._id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === analysis._id
                              ? <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
                              : <FiTrash2 />
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {pagination.total}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.total, p + 1))}
                  disabled={page === pagination.total}
                  className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
