import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiX, FiLock } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '', bio: user?.bio || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    setSaving(true);
    try {
      await api.put('/auth/change-password', pwForm);
      toast.success('Password changed successfully!');
      setChangingPw(false);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
        </div>

        {/* Profile card */}
        <div className="card mb-6">
          {/* Avatar & name header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user?.role}
                </span>
              </div>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-2">
                <FiEdit3 /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-3">
                  <FiX />
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{user?.totalAnalyses || 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total Analyses</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-2xl font-bold text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Member Since</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 capitalize">{user?.role || 'User'}</p>
              <p className="text-xs text-gray-500 mt-0.5">Account Type</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiUser className="text-gray-400 text-xs" />Full Name</label>
              {editing ? (
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 text-sm">{user?.name || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiMail className="text-gray-400 text-xs" />Email</label>
              <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-500 text-sm">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiPhone className="text-gray-400 text-xs" />Phone</label>
              {editing ? (
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" placeholder="+91 98765 43210" />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 text-sm">{user?.phone || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiMapPin className="text-gray-400 text-xs" />Location</label>
              {editing ? (
                <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="input-field" placeholder="City, Country" />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 text-sm">{user?.location || '—'}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              {editing ? (
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Tell us about yourself..." />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 text-sm min-h-[60px]">{user?.bio || '—'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiLock className="text-gray-600 text-sm" />
              </div>
              <h3 className="font-semibold text-gray-900">Password & Security</h3>
            </div>
            <button onClick={() => setChangingPw(!changingPw)} className="text-sm text-blue-600 font-medium hover:underline">
              {changingPw ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {!changingPw ? (
            <p className="text-sm text-gray-500">Your password is encrypted and secure. Use a strong, unique password to protect your account.</p>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input type="password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} className="input-field" placeholder="Min 8 characters" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} className="input-field" required />
              </div>
              <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5 px-6">
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
