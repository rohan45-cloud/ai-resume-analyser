import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const pwChecks = [
    { label: 'At least 8 characters', valid: form.password.length >= 8 },
    { label: 'Contains a number', valid: /\d/.test(form.password) },
    { label: 'Passwords match', valid: form.password === form.confirmPassword && form.confirmPassword.length > 0 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password);
      toast.success(`Welcome, ${data.user.name.split(' ')[0]}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 flex-col justify-center p-12 text-white">
        <div className="max-w-md">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
            <MdAutoAwesome className="text-2xl" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Start analyzing<br />for free</h2>
          <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
            Join thousands of job seekers who use ResumeAI to land interviews at top companies.
          </p>
          <div className="bg-white/10 rounded-2xl p-5 space-y-3">
            <p className="font-semibold text-sm uppercase tracking-wide text-indigo-200">What you get free:</p>
            {['Unlimited ATS score checks', 'AI resume analysis', 'Job description matching', 'Skills gap detection', 'Improvement suggestions'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <FiCheck className="text-green-400 shrink-0" /> <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-2">Free forever. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="John Doe" required className="input-field pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required className="input-field pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="Min 8 characters" required className="input-field pl-11 pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter password" required className="input-field pl-11" />
              </div>
            </div>

            {form.password.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {pwChecks.map(c => (
                  <span key={c.label} className={`flex items-center gap-1 text-xs font-medium ${c.valid ? 'text-green-600' : 'text-gray-400'}`}>
                    <FiCheck className={c.valid ? 'text-green-500' : 'text-gray-300'} /> {c.label}
                  </span>
                ))}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
