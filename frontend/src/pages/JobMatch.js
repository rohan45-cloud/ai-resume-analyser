import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiTarget, FiCheckCircle, FiAlertCircle, FiZap } from 'react-icons/fi';
import ScoreCircle from '../components/common/ScoreCircle';
import LoadingSpinner from '../components/common/LoadingSpinner';

const JobMatch = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [form, setForm] = useState({ jobTitle: '', jobDescription: '' });

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/resume/analysis/${id}`);
        const analysis = res.data.analysis;
        if (analysis.jobDescriptionMatch?.matchPercentage) {
          setMatchResult(analysis.jobDescriptionMatch);
          setForm({
            jobTitle: analysis.jobDescriptionMatch.jobTitle || '',
            jobDescription: analysis.jobDescriptionMatch.jobDescription || '',
          });
        }
      } catch { toast.error('Could not load resume data'); }
      finally { setLoading(false); }
    };
    fetchAnalysis();
  }, [id]);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!form.jobTitle.trim()) return toast.error('Please enter a job title');
    if (form.jobDescription.trim().length < 50) return toast.error('Please enter a more detailed job description');
    
    setMatching(true);
    try {
      const res = await api.post('/resume/match-jd', {
        analysisId: id,
        jobTitle: form.jobTitle,
        jobDescription: form.jobDescription,
      });
      setMatchResult(res.data.matchResult);
      toast.success('Job matching complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Matching failed. Please try again.');
    } finally {
      setMatching(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading..." /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/results/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Job Description Matching</h1>
            <p className="text-sm text-gray-500">See how well your resume matches a specific job</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FiTarget className="text-blue-600 text-sm" />
                </div>
                <h3 className="font-semibold text-gray-900">Paste Job Description</h3>
              </div>
              <form onSubmit={handleMatch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))}
                    placeholder="e.g. Senior Software Engineer"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description *</label>
                  <textarea
                    value={form.jobDescription}
                    onChange={e => setForm(p => ({ ...p, jobDescription: e.target.value }))}
                    placeholder="Paste the complete job description here..."
                    rows={10}
                    className="input-field resize-none"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.jobDescription.length} characters</p>
                </div>
                <button type="submit" disabled={matching} className="btn-primary w-full flex items-center justify-center gap-2">
                  {matching ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing match...
                    </>
                  ) : (
                    <><FiZap /> Analyze Match</>
                  )}
                </button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
                <strong>Tip:</strong> Copy the full JD including requirements, responsibilities, and qualifications for the most accurate match.
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {!matchResult && !matching && (
              <div className="card flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200">
                <FiTarget className="text-4xl text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">No match results yet</h3>
                <p className="text-sm text-gray-500">Paste a job description on the left and click "Analyze Match" to see how well your resume fits</p>
              </div>
            )}

            {matching && (
              <div className="card flex flex-col items-center justify-center py-16 text-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                  <div className="absolute inset-3 flex items-center justify-center">
                    <FiTarget className="text-blue-600 text-xl" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Matching your resume...</h3>
                <p className="text-sm text-gray-500">AI is comparing your resume with the job requirements</p>
              </div>
            )}

            {matchResult && !matching && (
              <div className="space-y-4 fade-in">
                {/* Match score */}
                <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                  <div className="flex items-center gap-6">
                    <ScoreCircle score={matchResult.matchPercentage || 0} size={120} strokeWidth={10} />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{matchResult.jobTitle}</h3>
                      <p className="text-gray-500 text-sm mt-1">Resume Match Score</p>
                      <p className={`text-2xl font-bold mt-2 ${matchResult.matchPercentage >= 70 ? 'text-green-600' : matchResult.matchPercentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {matchResult.matchPercentage}% Match
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {matchResult.matchPercentage >= 70 ? '✅ Strong match — Apply with confidence!' :
                         matchResult.matchPercentage >= 50 ? '⚠️ Moderate match — Some improvements needed' :
                         '❌ Weak match — Significant gaps to address'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matched Skills */}
                <div className="card">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <FiCheckCircle className="text-green-500" /> Matched Skills ({matchResult.matchedSkills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matchedSkills?.map(s => (
                      <span key={s} className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                    ))}
                    {!matchResult.matchedSkills?.length && <p className="text-sm text-gray-400">No matches found</p>}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="card">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <FiAlertCircle className="text-red-500" /> Missing Skills ({matchResult.missingSkills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missingSkills?.map(s => (
                      <span key={s} className="bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                    ))}
                    {!matchResult.missingSkills?.length && <p className="text-sm text-green-600 font-medium">✓ No missing skills! Great match.</p>}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="card">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <FiZap className="text-blue-500" /> Suggestions to Improve Match
                  </h4>
                  <ul className="space-y-2">
                    {matchResult.suggestions?.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatch;
