import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Calendar, Clock, CheckCircle, XCircle,
  Star, Search, CalendarDays, IndianRupee, RefreshCw, BrainCircuit,
  GraduationCap, Briefcase, MapPin, BarChart3, PieChart,
  Download, Trash2, ShieldCheck, Mail, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [viewIntake, setViewIntake] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', reason: '' });

  useEffect(() => {
    fetchAllData();
    const pollId = setInterval(fetchAllData, 30000);
    return () => clearInterval(pollId);
  }, []);

  const fetchAllData = () => {
    fetchAdminData();
    fetchUsers();
    fetchAnalytics();
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/sessions`, API());
      setBookings(res.data.bookings);
      setStats(res.data.stats);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, API());
      setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`, API());
      setAnalytics(res.data.analytics);
    } catch (err) {
      console.error('Analytics fetch error', err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/sessions/${id}/cancel`, { reason: 'Administrative Conflict' }, API());
      toast.success('Session cancelled & client notified');
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to cancel session');
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      toast.error('Please select a new date and time');
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/sessions/${selectedBooking._id}/reschedule`,
        { newDate: rescheduleData.date, newTime: rescheduleData.time, reason: rescheduleData.reason },
        API()
      );
      toast.success('Session rescheduled & client notified');
      setSelectedBooking(null);
      setRescheduleData({ date: '', time: '', reason: '' });
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to reschedule');
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/sessions/${id}/complete`, {}, API());
      toast.success('Session marked as completed');
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Remove this user account? Their booking history will be preserved.")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, API());
      toast.success('User account removed');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const exportToCSV = () => {
    const headers = ['Ticket ID', 'Client', 'Phone', 'Email', 'Date', 'Time', 'Status', 'Revenue (INR)'];
    const rows = filteredBookings.map(b => [
      b.ticketId, b.name, b.phone, b.email, b.date, b.time, b.status, '1500'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `sessions_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`;
    link.click();
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'upcoming') return matchesSearch && (b.status === 'confirmed' || b.status === 'rescheduled');
    if (filter === 'cancelled') return matchesSearch && b.status === 'cancelled';
    if (filter === 'completed') return matchesSearch && b.sessionCompleted;
    if (filter === 'feedback') return matchesSearch && b.feedbackSubmitted;
    return matchesSearch;
  });

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium">Loading Admin Suite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 font-serif">Admin Dashboard</h1>
            <p className="text-slate-500 mt-2 italic">Management sanctuary for Counseling Psychologist</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Live · Updates every 30s</span>
            </div>
            <button
              onClick={fetchAllData}
              className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-primary font-bold"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-md p-1.5 rounded-3xl border border-slate-200 shadow-sm w-fit overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard', icon: BarChart3 },
            { id: 'sessions', label: 'Sessions', icon: Calendar },
            { id: 'clients', label: 'Clients', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: PieChart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-[20px] font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-emerald-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Sessions', value: stats?.total ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Confirmed / Upcoming', value: stats?.upcoming ?? 0, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Revenue (INR)', value: `₹${(stats?.revenue ?? 0).toLocaleString()}`, icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Avg Client Rating', value: stats?.feedbackAvg > 0 ? stats.feedbackAvg.toFixed(1) : '—', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-[20px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-[45px] p-10 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 font-serif">Recent Activity</h3>
                <button onClick={() => setActiveTab('sessions')} className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                  View All <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              {bookings.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No bookings yet. Share your booking link!</p>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b._id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:border-slate-200 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary text-lg">
                          {b.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{b.name}</p>
                          <p className="text-xs text-slate-500">{b.date} · {b.time}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        b.status === 'rescheduled' ? 'bg-blue-100 text-blue-700' :
                        b.sessionCompleted ? 'bg-slate-100 text-slate-500' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {b.sessionCompleted ? 'Completed' : b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SESSIONS TAB ── */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or ticket ID..."
                  className="w-full pl-12 pr-4 py-4 rounded-[24px] border border-slate-200 focus:border-primary outline-none shadow-sm bg-white"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center bg-white p-1.5 rounded-[22px] border border-slate-200 shadow-sm gap-1">
                  {['all', 'upcoming', 'cancelled', 'completed', 'feedback'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-[18px] text-xs font-bold capitalize transition-all ${filter === f ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center space-x-2 bg-white px-5 py-3 rounded-[22px] border border-slate-200 shadow-sm hover:border-primary transition-all text-slate-700 font-bold text-sm"
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-white rounded-[45px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Client</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ticket</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredBookings.length === 0 ? (
                      <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400">No sessions found</td></tr>
                    ) : filteredBookings.map(b => (
                      <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center text-sm">
                              {b.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{b.name}</div>
                              <div className="text-xs text-slate-500">{b.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center text-slate-700 font-bold text-sm">
                            <CalendarDays className="w-4 h-4 mr-2 text-primary shrink-0" /> {b.date}
                          </div>
                          <div className="flex items-center text-slate-400 text-xs mt-1">
                            <Clock className="w-3.5 h-3.5 mr-2 shrink-0" /> {b.time}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            b.sessionCompleted ? 'bg-slate-100 text-slate-600' :
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            b.status === 'rescheduled' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {b.sessionCompleted ? 'Completed' : b.status}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <code className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs text-slate-600 font-bold">{b.ticketId}</code>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center space-x-1">
                            <button onClick={() => setViewIntake(b)} className="p-2.5 hover:bg-emerald-50 rounded-2xl transition-all text-emerald-500" title="View Assessment">
                              <BrainCircuit className="w-4 h-4" />
                            </button>
                            {b.status !== 'cancelled' && !b.sessionCompleted && (
                              <>
                                <button onClick={() => setSelectedBooking(b)} className="p-2.5 hover:bg-blue-50 rounded-2xl transition-all text-blue-500" title="Reschedule">
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleCancel(b._id)} className="p-2.5 hover:bg-red-50 rounded-2xl transition-all text-red-400" title="Cancel Session">
                                  <XCircle className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleComplete(b._id)} className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-primary" title="Mark Complete">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {b.feedbackSubmitted && (
                              <div className="flex items-center text-amber-500 font-black bg-amber-50 px-3 py-1 rounded-xl text-xs ml-1">
                                <Star className="w-3.5 h-3.5 fill-current mr-1" /> {b.feedback?.rating}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── CLIENTS TAB ── */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[45px] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400">No registered users yet</td></tr>
                  ) : users.map(user => (
                    <tr key={user._id} className="hover:bg-slate-50/70">
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" /> {user.email}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-8 py-5">
                        <button onClick={() => handleDeleteUser(user._id)} className="p-2.5 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-2xl transition-all" title="Remove Account">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Concerns */}
            <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 font-serif mb-8 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-3 text-primary" /> Primary Client Concerns
              </h3>
              {!analytics || Object.keys(analytics.concerns).length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">Analytics will appear after your first paid booking.</p>
              ) : (
                <div className="space-y-5">
                  {Object.entries(analytics.concerns).sort((a, b) => b[1] - a[1]).map(([key, val]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold text-slate-600">
                        <span>{key}</span>
                        <span className="text-primary">{val} {val === 1 ? 'client' : 'clients'}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-primary rounded-full transition-all duration-1000"
                          style={{ width: `${(val / Math.max(...Object.values(analytics.concerns))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Occupation Distribution */}
            <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 font-serif mb-8 flex items-center">
                <Briefcase className="w-5 h-5 mr-3 text-blue-500" /> Client Occupations
              </h3>
              {!analytics || Object.keys(analytics.occupations).length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">Analytics will appear after your first paid booking.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(analytics.occupations).sort((a, b) => b[1] - a[1]).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-[20px] border border-slate-100">
                      <span className="font-bold text-slate-700">{key}</span>
                      <span className="bg-white px-4 py-1.5 rounded-full text-xs font-black text-blue-600 border border-blue-100">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RESCHEDULE MODAL ── */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[45px] shadow-2xl w-full max-w-lg p-10 animate-fade-in">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 font-serif">Reschedule Session</h3>
                  <p className="text-slate-400 italic mt-1 text-sm">Client: {selectedBooking.name}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">New Date</label>
                  <input
                    type="date"
                    className="w-full p-4 rounded-[20px] border border-slate-200 outline-none focus:border-primary bg-slate-50"
                    onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">New Time Slot</label>
                  <select
                    className="w-full p-4 rounded-[20px] border border-slate-200 outline-none focus:border-primary bg-slate-50"
                    onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  >
                    <option value="">Select Time</option>
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                    <option>06:30 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Reason for Client</label>
                  <textarea
                    placeholder="e.g. Unforeseen clinical commitment..."
                    className="w-full p-4 h-28 rounded-[20px] border border-slate-200 outline-none focus:border-primary bg-slate-50 resize-none"
                    onChange={e => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setSelectedBooking(null)} className="flex-1 py-4 rounded-[20px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleReschedule} className="flex-1 py-4 rounded-[20px] font-bold bg-primary text-white shadow-lg active:scale-95 transition-transform">
                    Confirm Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INTAKE / ASSESSMENT MODAL ── */}
        {viewIntake && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[45px] shadow-2xl w-full max-w-2xl p-10 animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 font-serif">Client Intake Assessment</h3>
                  <p className="text-slate-400 italic mt-1 text-sm">Full profile for {viewIntake.name}</p>
                </div>
                <button onClick={() => setViewIntake(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Demographics */}
                <div className="space-y-4">
                  <h4 className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <MapPin className="w-4 h-4 mr-2" /> Demographics
                  </h4>
                  {[
                    { label: 'Age', val: viewIntake.assessment?.age },
                    { label: 'Gender', val: viewIntake.assessment?.gender },
                    { label: 'Location', val: viewIntake.assessment?.cityState },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-2.5 border-b border-slate-50">
                      <span className="text-slate-400 text-sm">{item.label}</span>
                      <span className="font-bold text-slate-700 text-sm">{item.val || 'N/A'}</span>
                    </div>
                  ))}
                </div>

                {/* Background */}
                <div className="space-y-4">
                  <h4 className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <GraduationCap className="w-4 h-4 mr-2" /> Background
                  </h4>
                  {[
                    { label: 'Education', val: viewIntake.assessment?.education },
                    { label: 'Occupation', val: viewIntake.assessment?.occupation },
                    { label: 'Income Level', val: viewIntake.assessment?.income },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-2.5 border-b border-slate-50">
                      <span className="text-slate-400 text-sm">{item.label}</span>
                      <span className="font-bold text-slate-700 text-sm">{item.val || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mind Status */}
              <div className="bg-slate-50 p-8 rounded-[35px] border border-slate-100 space-y-6">
                <h4 className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  <BrainCircuit className="w-4 h-4 mr-2" /> Mind Status & Concerns
                </h4>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Primary Concern</span>
                  <span className="text-lg font-bold text-slate-800">{viewIntake.assessment?.primaryConcern || 'General Support'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mood Index</span>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-primary rounded-full transition-all duration-1000"
                        style={{ width: `${(viewIntake.assessment?.moodRating || 5) * 10}%` }}
                      />
                    </div>
                    <span className="font-black text-primary text-lg">{viewIntake.assessment?.moodRating || 5}/10</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Client Note</span>
                  <p className="text-slate-600 leading-relaxed italic text-sm">"{viewIntake.assessment?.description || 'No additional notes provided.'}"</p>
                </div>
              </div>

              <button
                onClick={() => setViewIntake(null)}
                className="w-full mt-8 py-5 rounded-[24px] font-bold bg-primary text-white shadow-xl active:scale-95 transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
