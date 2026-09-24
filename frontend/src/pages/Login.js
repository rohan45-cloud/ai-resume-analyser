import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdAutoAwesome } from 'react-icons/md';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!form.email || !form.password) return toast.error('Please fill in all fields');
        try {
            const data = await login(form.email, form.password);
            toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 🎉`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col justify-center p-12 text-white">
                <div className="max-w-md">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                        <MdAutoAwesome className="text-2xl" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Welcome back!</h2>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">Log in to continue analyzing your resume and tracking your progress toward your dream job.</p>
                    <div className="space-y-4">
                        {['Instant ATS scoring', 'AI-powered suggestions', 'Job description matching', 'Analysis history'].map(item => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                                <span className="text-blue-100">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Create one free
                        </Link>
                    </p>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
                    <strong>Demo:</strong> Register a new account or use admin@resumeai.com
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
                        <p className="mt-2 text-gray-600">Access your Resume AI account.</p>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;