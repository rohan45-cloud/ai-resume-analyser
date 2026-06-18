import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiUsers, FiFileText, FiTrendingUp, FiZap, FiTrash2, FiToggleLeft, FiToggleRight, FiSearch } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import LoadingSpinner from '../components/common/LoadingSpinner';

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

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [actionLoading, setActionLoading] = useState(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    fetchReports();
    fetchUsers();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setData(res.data);
    } catch { toast.error('Failed to load reports'); }
    finally { setLoadingReports(false); }
  };

  const fetchUsers = async (q = '') => {
    setLoadingUsers(true);
    try {
      const res = await api.get(`/admin/users?search=${q}&limit=20`);
      setUsers(res.data.users || []);
    } catch {}
    finally { setLoadingUsers(false); }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => fetchUsers(value), 400);
  };

  const handleToggle = async (userId, name) => {
    setActionLoading(userId);
    try {
      const res = await api.put(`/admin/users/${userId}/toggle`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: res.data.user.isActive } : u));
      toast.success(`${name} ${res.data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Action failed'); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}" and ALL their data? This cannot be undone.`)) return;
    setActionLoading(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
    finally { setActionLoading(null); }
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = data?.monthlyStats?.map(m => ({
    month: monthNames[m._id.month - 1],
    analyses: m.count,
    avgScore: Math.round(m.avgScore),
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage users, view analytics, and monitor platform performance</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
          {['overview', 'users', 'analyses'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <>
            {loadingReports ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Loading reports..." /></div> : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard icon={FiUsers} label="Total Users" value={data?.stats?.totalUsers || 0} color="text-blue-600" bg="bg-blue-50" />
                  <StatCard icon={FiFileText} label="Total Analyses" value={data?.stats?.totalAnalyses || 0} color="text-indigo-600" bg="bg-indigo-50" />
                  <StatCard icon={FiTrendingUp} label="Avg ATS Score" value={data?.stats?.avgAtsScore || '—'} color="text-green-600" bg="bg-green-50" />
                  <StatCard icon={FiZap} label="Success Rate" value={`${data?.stats?.successRate || 0}%`} color="text-amber-600" bg="bg-amber-50" />
                </div>

                {/* Chart */}
                <div className="card mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Monthly Analyses (Last 6 months)</h3>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                        <Bar dataKey="analyses" fill="#2563eb" radius={[4, 4, 0, 0]} name="Analyses" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p className="text-sm text-gray-400 text-center py-8">No data yet</p>}
                </div>

                {/* Recent analyses */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Analyses</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">User</th>
                          <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">File</th>
                          <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">ATS Score</th>
                          <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.recentAnalyses || []).map(a => (
                          <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2 font-medium text-gray-900">{a.user?.name || 'Unknown'}</td>
                            <td className="py-3 px-2 text-gray-500 truncate max-w-[180px]">{a.fileName}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.atsScore >= 70 ? 'bg-green-100 text-green-700' : a.atsScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                                {a.atsScore}/100
                              </span>
                            </td>
                            <td className="py-3 px-2 text-gray-400 text-xs">
                              {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!data?.recentAnalyses?.length && <p className="text-center text-gray-400 text-sm py-6">No analyses yet</p>}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text" value={search} onChange={handleSearch}
                  placeholder="Search users..."
                  className="input-field pl-9 py-2 text-sm"
                />
              </div>
              <p className="text-sm text-gray-500">{users.length} users</p>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-10"><LoadingSpinner text="Loading users..." /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Name', 'Email', 'Role', 'Analyses', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-500">{u.email}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-medium">{u.totalAnalyses || 0}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-xs">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                        <td className="py-3 px-3">
                          {u.role !== 'admin' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggle(u._id, u.name)}
                                disabled={actionLoading === u._id}
                                className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}
                                title={u.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {u.isActive ? <FiToggleRight className="text-lg" /> : <FiToggleLeft className="text-lg" />}
                              </button>
                              <button
                                onClick={() => handleDelete(u._id, u.name)}
                                disabled={actionLoading === u._id}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                title="Delete user"
                              >
                                {actionLoading === u._id
                                  ? <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
                                  : <FiTrash2 />
                                }
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!users.length && <p className="text-center text-gray-400 text-sm py-8">No users found</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
