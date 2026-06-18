import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FiArrowLeft, FiDownload, FiTarget, FiCheckCircle, FiAlertCircle, FiZap,
  FiTrendingUp, FiBook, FiBriefcase, FiCode, FiKey
} from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import ScoreCircle from '../components/common/ScoreCircle';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SectionCard = ({ icon: Icon, title, children, className = '' }) => (
  <div className={`card ${className}`}>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
        <Icon className="text-blue-600 text-sm" />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const Tag = ({ text, variant = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
    amber: 'bg-amber-100 text-amber-700',
  };
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors[variant]}`}>{text}</span>;
};

const ATSResult = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/resume/analysis/${id}`);
        setAnalysis(res.data.analysis);
      } catch (err) {
        toast.error('Could not load analysis');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading your analysis..." /></div>;
  if (!analysis) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Analysis not found.</p></div>;

  const { atsScore, analysis: data, fileName, createdAt } = analysis;

  const radarData = [
    { subject: 'Skills', A: data.skills?.found?.length > 0 ? Math.min(data.skills.found.length * 8, 100) : 40 },
    { subject: 'Experience', A: data.experience?.score || 60 },
    { subject: 'Education', A: data.education?.score || 60 },
    { subject: 'Projects', A: data.projects?.score || 50 },
    { subject: 'Keywords', A: data.keywords?.density ? Math.min(data.keywords.density * 2, 100) : 45 },
    { subject: 'ATS Score', A: atsScore },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resume Analysis Results</h1>
              <p className="text-sm text-gray-500 mt-0.5">{fileName} • {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <Link to={`/job-match/${id}`} className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
            <FiTarget /> Match with JD
          </Link>
        </div>

        {/* Top summary row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">

          {/* ATS Score card */}
          <div className="card flex flex-col items-center py-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">ATS Score</p>
            <ScoreCircle score={atsScore} size={160} strokeWidth={12} />
            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Experience</span><span className="font-medium">{data.experience?.score || 0}/100</span></div>
              <ProgressBar value={data.experience?.score || 0} color={data.experience?.score >= 70 ? 'green' : 'amber'} showValue={false} />
              <div className="flex justify-between text-sm"><span className="text-gray-500">Education</span><span className="font-medium">{data.education?.score || 0}/100</span></div>
              <ProgressBar value={data.education?.score || 0} color="blue" showValue={false} />
              <div className="flex justify-between text-sm"><span className="text-gray-500">Projects</span><span className="font-medium">{data.projects?.score || 0}/100</span></div>
              <ProgressBar value={data.projects?.score || 0} color="indigo" showValue={false} />
            </div>
          </div>

          {/* Radar chart */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Resume Radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Radar name="Resume" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Overall feedback */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <MdAutoAwesome className="text-blue-600 text-lg" />
              <h3 className="font-semibold text-gray-900">AI Feedback</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{data.overallFeedback}</p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-green-700 font-semibold mb-1">Strengths</p>
                <p className="text-2xl font-bold text-green-600">{data.strengths?.length || 0}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-xs text-red-700 font-semibold mb-1">Weaknesses</p>
                <p className="text-2xl font-bold text-red-500">{data.weaknesses?.length || 0}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-700 font-semibold mb-1">Skills Found</p>
                <p className="text-2xl font-bold text-blue-600">{data.skills?.found?.length || 0}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-semibold mb-1">Missing Skills</p>
                <p className="text-2xl font-bold text-amber-600">{data.skills?.missing?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Skills Found */}
          <SectionCard icon={FiCheckCircle} title="Skills Detected">
            {data.skills?.found?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.found.map(s => <Tag key={s} text={s} variant="green" />)}
              </div>
            ) : <p className="text-sm text-gray-400">No specific skills detected.</p>}
          </SectionCard>

          {/* Missing Skills */}
          <SectionCard icon={FiAlertCircle} title="Missing Skills">
            {data.skills?.missing?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.missing.map(s => <Tag key={s} text={s} variant="red" />)}
              </div>
            ) : <p className="text-sm text-green-600 font-medium">✓ Great! No critical skills missing.</p>}
          </SectionCard>

          {/* Strengths */}
          <SectionCard icon={FiTrendingUp} title="Your Strengths">
            <ul className="space-y-2">
              {(data.strengths || []).map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Weaknesses */}
          <SectionCard icon={FiAlertCircle} title="Areas to Improve">
            <ul className="space-y-2">
              {(data.weaknesses || []).map((w, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <FiAlertCircle className="text-amber-500 mt-0.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Experience */}
          <SectionCard icon={FiBriefcase} title={`Experience Analysis ${data.experience?.yearsOfExperience ? `• ${data.experience.yearsOfExperience} yrs` : ''}`}>
            <ProgressBar value={data.experience?.score || 0} label="Experience Score" color={data.experience?.score >= 70 ? 'green' : 'amber'} />
            {data.experience?.summary && <p className="text-sm text-gray-600 mt-3">{data.experience.summary}</p>}
            {data.experience?.details?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {data.experience.details.slice(0, 4).map((d, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 shrink-0">•</span>{d}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Education */}
          <SectionCard icon={FiBook} title="Education Analysis">
            <ProgressBar value={data.education?.score || 0} label="Education Score" color="blue" />
            {data.education?.summary && <p className="text-sm text-gray-600 mt-3">{data.education.summary}</p>}
            {data.education?.details?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {data.education.details.map((d, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 shrink-0">•</span>{d}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Projects */}
          <SectionCard icon={FiCode} title={`Projects ${data.projects?.count ? `• ${data.projects.count} found` : ''}`}>
            <ProgressBar value={data.projects?.score || 0} label="Projects Score" color="indigo" />
            {data.projects?.summary && <p className="text-sm text-gray-600 mt-3">{data.projects.summary}</p>}
            {data.projects?.details?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {data.projects.details.slice(0, 4).map((d, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-indigo-500 shrink-0">•</span>{d}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Keywords */}
          <SectionCard icon={FiKey} title="Keyword Analysis">
            <div className="mb-3">
              <ProgressBar value={Math.min((data.keywords?.density || 0) * 2, 100)} label={`Keyword Density: ${data.keywords?.density || 0}%`} color="purple" />
            </div>
            {data.keywords?.found?.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">Found Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.keywords.found.slice(0, 12).map(k => <Tag key={k} text={k} variant="blue" />)}
                </div>
              </>
            )}
            {data.keywords?.missing?.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">Missing Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.keywords.missing.slice(0, 8).map(k => <Tag key={k} text={k} variant="gray" />)}
                </div>
              </>
            )}
          </SectionCard>
        </div>

        {/* Suggestions */}
        <div className="mt-6">
          <SectionCard icon={FiZap} title="AI Improvement Suggestions" className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="grid sm:grid-cols-2 gap-3">
              {(data.suggestions || []).map((suggestion, i) => (
                <div key={i} className="flex gap-3 bg-white rounded-xl p-3 border border-blue-100">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Bottom actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to={`/job-match/${id}`} className="btn-primary inline-flex items-center gap-2">
            <FiTarget /> Match with Job Description
          </Link>
          <Link to="/upload" className="btn-secondary inline-flex items-center gap-2">
            <FiDownload /> Analyze Another Resume
          </Link>
          <Link to="/history" className="btn-secondary inline-flex items-center gap-2">
            View All History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ATSResult;
