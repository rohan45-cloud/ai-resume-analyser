import React from 'react';
import { Link } from 'react-router-dom';
import { MdAutoAwesome } from 'react-icons/md';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MdAutoAwesome className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">
              Resume <span className="text-blue-400">AI</span>
            </span>
          </Link>

          <p className="text-sm leading-relaxed max-w-xs">
            AI-powered resume analysis platform that helps you beat ATS systems and land your dream job.
          </p>

          <div className="flex gap-3 mt-4">
            <a
              href="https://github.com/rohan45-cloud"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiGithub size={18} />
            </a>
            <a
              href="https://twitter.com/rohan45_cloud"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiTwitter size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/rohan-sharma-764202288"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiLinkedin size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
          <ul className="space-y-2 text-sm">
            {[
              ['/', 'Home'],
              ['/about', 'About'],
              ['/register', 'Get Started'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Features</h4>
          <ul className="space-y-2 text-sm">
            {['ATS Score', 'Skills Analysis', 'Job Matching', 'AI Suggestions', 'Resume History'].map(
              (feature) => (
                <li key={feature}>
                  <span>{feature}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
        <p>
          ©{new Date().getFullYear()} ResumeAI. All rights reserved. Built with ❤️ using MERN + Gemini AI
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;