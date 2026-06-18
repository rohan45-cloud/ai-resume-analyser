import React from 'react';
import { Link } from 'react-router-dom';
import { MdAutoAwesome, MdSpeed, MdWorkOutline, MdTrendingUp } from 'react-icons/md';
import { FiCheck, FiUpload, FiZap, FiBarChart2, FiShield, FiStar } from 'react-icons/fi';

const StatCard = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-600">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="card-hover group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="text-white text-xl" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-lg shadow-blue-200">
      {number}
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const Home = () => {
  const features = [
    { icon: MdSpeed, title: 'Instant ATS Score', description: 'Get your resume scored out of 100 instantly against real ATS algorithms used by top companies.', color: 'bg-blue-600' },
    { icon: FiZap, title: 'AI-Powered Analysis', description: 'Gemini AI deeply analyzes your resume for skills, experience, education, and key gaps.', color: 'bg-indigo-600' },
    { icon: MdWorkOutline, title: 'Job Description Matching', description: 'Paste any JD and see exactly how well your resume matches with a detailed breakdown.', color: 'bg-violet-600' },
    { icon: FiBarChart2, title: 'Skills Gap Analysis', description: 'Discover which skills you have and which critical ones are missing for your target roles.', color: 'bg-sky-600' },
    { icon: MdTrendingUp, title: 'Smart Suggestions', description: 'Get 8+ actionable improvement suggestions to make your resume stand out to recruiters.', color: 'bg-teal-600' },
    { icon: FiShield, title: 'Analysis History', description: 'Track your resume improvements over time with saved analysis history and progress.', color: 'bg-emerald-600' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Software Engineer at Google', text: 'ResumeAI helped me increase my ATS score from 42 to 87. Got 3 interview calls within a week!', stars: 5 },
    { name: 'Rahul Gupta', role: 'Data Scientist at Amazon', text: 'The job description matching feature is incredible. It told me exactly which skills I needed to add.', stars: 5 },
    { name: 'Ananya Singh', role: 'Product Manager at Flipkart', text: 'The AI suggestions were spot on. My resume finally started getting noticed by recruiters.', stars: 5 },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <MdAutoAwesome className="text-base" /> Powered by Gemini AI
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight text-balance">
              Make Your Resume
              <span className="gradient-text block">Beat Every ATS</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your resume, get an instant ATS score, AI-powered analysis, skills gap detection, and personalized suggestions to land more interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2 justify-center">
                <FiUpload /> Analyze My Resume Free
              </Link>
              <Link to="/about" className="btn-secondary text-base px-8 py-4 inline-flex items-center justify-center">
                See How It Works
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-8 text-sm text-gray-500">
              {['No credit card required', 'PDF & DOCX supported', 'Instant results', 'AI-powered'].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <FiCheck className="text-green-500 font-bold" /> {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="50K+" label="Resumes Analyzed" />
            <StatCard value="92%" label="Interview Rate Boost" />
            <StatCard value="4.9★" label="User Rating" />
            <StatCard value="< 30s" label="Analysis Time" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything you need to get hired</h2>
            <p className="section-subtitle">Comprehensive AI analysis in seconds, not hours</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to a better resume</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <StepCard number="1" title="Upload Your Resume" description="Upload your resume in PDF or DOCX format. Our system securely processes your file." />
            <StepCard number="2" title="AI Analyzes It" description="Gemini AI deeply analyzes your resume for ATS compatibility, skills, and improvements." />
            <StepCard number="3" title="Get Your Results" description="Receive detailed ATS score, skills gap, and actionable suggestions to land interviews." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Loved by job seekers</h2>
            <p className="text-blue-200 mt-2">Join thousands who landed their dream jobs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, i) => <FiStar key={i} className="text-yellow-300 fill-current" />)}
                </div>
                <p className="text-blue-50 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-blue-300 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to optimize your resume?</h2>
          <p className="text-gray-500 mb-8">Join 50,000+ professionals who use ResumeAI to stand out</p>
          <Link to="/register" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
            <FiUpload /> Start For Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
