import React from 'react';
import { Link } from 'react-router-dom';
import { MdAutoAwesome } from 'react-icons/md';
import { FiTarget, FiUsers, FiAward, FiShield, FiArrowRight } from 'react-icons/fi';

const ValueCard = ({ icon: Icon, title, desc }) => (
  <div className="card-hover text-center">
    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
      <Icon className="text-blue-600 text-xl" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const About = () => (
  <div>
    {/* Hero */}
    <section className="bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 items-center justify-center mb-6 shadow-lg shadow-blue-200">
          <MdAutoAwesome className="text-white text-2xl" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          About <span className="gradient-text">ResumeAI</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          We're on a mission to help job seekers beat ATS systems and land more interviews using the power of AI.
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Every year, millions of qualified candidates get rejected before a human even sees their resume — filtered out by Applicant Tracking Systems (ATS) that scan for keywords, formatting, and structure. We built ResumeAI to level the playing field.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Using advanced AI models like Gemini, we analyze resumes the same way modern ATS and recruiters do — checking for relevant skills, quantifiable achievements, proper formatting, and keyword optimization. Then we give you specific, actionable feedback to improve your chances.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you're a fresh graduate or an experienced professional switching careers, ResumeAI gives you the insights you need to craft a resume that gets noticed — by both machines and humans.
        </p>
      </div>
    </section>

    {/* Values */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">What We Stand For</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <ValueCard icon={FiTarget} title="Accuracy" desc="Our AI provides precise, data-driven analysis based on real ATS algorithms." />
          <ValueCard icon={FiUsers} title="Accessibility" desc="Career growth tools should be free and available to everyone, everywhere." />
          <ValueCard icon={FiAward} title="Excellence" desc="We constantly improve our AI models to give you the best possible feedback." />
          <ValueCard icon={FiShield} title="Privacy" desc="Your resume data is encrypted and never shared with third parties." />
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
        <p className="text-gray-500 mb-8">Join thousands of job seekers improving their resumes today</p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2">
          Get Started Free <FiArrowRight />
        </Link>
      </div>
    </section>
  </div>
);

export default About;
