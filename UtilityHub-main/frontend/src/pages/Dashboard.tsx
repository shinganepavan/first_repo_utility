import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, History, Settings, Shield, Check, AlertCircle, Database, BarChart3, Users, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { TOOLS } from '../utils/toolDefinitions';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { DynamicIcon } from '../components/common/DynamicIcon';

interface AdminStats {
  totalUsers: number;
  totalExecutions: number;
  aiCreditsUsed: number;
  activeSessions: number;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { favorites, recentlyUsed, clearRecent } = useFavorites();

  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'history' | 'admin'>('profile');
  
  // Profile settings state
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Admin states
  const adminStats: AdminStats = {
    totalUsers: 481,
    totalExecutions: 24908,
    aiCreditsUsed: 1243,
    activeSessions: 18,
  };

  const registeredUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', created: '2026-07-01' },
    { id: 2, name: 'Sarah Connor', email: 'sarah@skynet.com', role: 'admin', created: '2026-05-12' },
    { id: 3, name: 'Alan Turing', email: 'turing@enigma.org', role: 'user', created: '2026-06-18' },
    { id: 4, name: 'Ada Lovelace', email: 'ada@computing.uk', role: 'user', created: '2026-06-25' },
  ];

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const ok = await updateProfile(name, email);
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('Failed to update profile. Email might be in use.');
      }
    } catch {
      setSaveError('An unexpected network error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const favoritedTools = TOOLS.filter(t => favorites.includes(t.id));
  const recentTools = TOOLS.filter(t => recentlyUsed.includes(t.id));

  return (
    <div className="space-y-8 py-6">
      
      {/* User Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/10 uppercase">
            {user.full_name.charAt(0)}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {user.full_name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Account level: <span className="capitalize font-semibold text-indigo-500">{user.role}</span>
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-950/50">
          Sign Out
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-indigo-500 text-indigo-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Settings & Profile
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'border-indigo-500 text-indigo-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          My Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-indigo-500 text-indigo-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Run History ({recentlyUsed.length})
        </button>
        {user.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'admin'
                ? 'border-indigo-500 text-indigo-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Panel
          </button>
        )}
      </div>

      {/* Tab Contents */}
      <div className="min-h-96">
        {activeTab === 'profile' && (
          <Card hoverEffect={false} className="max-w-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-[#0c101d]/60">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h3>
            
            {saveSuccess && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2 text-xs font-semibold">
                <Check className="w-4 h-4" />
                Profile updated successfully.
              </div>
            )}
            {saveError && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4" />
                {saveError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="sm" className="text-xs" isLoading={isSaving}>
                Save Changes
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Favorited Utilities</h3>
            {favoritedTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedTools.map((tool) => (
                  <Card key={tool.id} className="border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/30 flex flex-col justify-between h-full bg-white/60 dark:bg-[#0c101d]/60">
                    <div>
                      <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 inline-flex mb-4">
                        <DynamicIcon name={tool.icon} size={15} />
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">{tool.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-6">{tool.description}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/tools/${tool.id}`)} className="text-xs w-full">
                      Open Tool
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                No favorited tools yet. Browse the directory and click the star icon!
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Run History</h3>
              {recentTools.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearRecent} className="text-xs text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20">
                  Clear All
                </Button>
              )}
            </div>
            
            {recentTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTools.map((tool) => (
                  <Card key={tool.id} className="border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/30 flex flex-col justify-between h-full bg-white/60 dark:bg-[#0c101d]/60">
                    <div>
                      <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 inline-flex mb-4">
                        <DynamicIcon name={tool.icon} size={15} />
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">{tool.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-6">{tool.description}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/tools/${tool.id}`)} className="text-xs w-full">
                      Run Again
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                No tool executions logged in this session.
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && user.role === 'admin' && (
          <div className="space-y-10">
            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400">Total Users</span>
                  <Users className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{adminStats.totalUsers}</p>
                <p className="text-[10px] text-green-500 font-semibold mt-1">+12% from last month</p>
              </Card>

              <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400">Total Executions</span>
                  <BarChart3 className="w-5 h-5 text-sky-500" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{adminStats.totalExecutions}</p>
                <p className="text-[10px] text-sky-500 font-semibold mt-1">+24% run volumes</p>
              </Card>

              <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400">AI Prompt Operations</span>
                  <Cpu className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{adminStats.aiCreditsUsed}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Capped at 5k monthly limit</p>
              </Card>

              <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400">Active Sessions</span>
                  <Database className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{adminStats.activeSessions}</p>
                <p className="text-[10px] text-green-500 font-semibold mt-1">Redis cache refresh active</p>
              </Card>
            </div>

            {/* Registered Users Table */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Registered Users</h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-[#0c101d]/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/10 transition-colors">
                        <td className="p-4 font-semibold text-slate-950 dark:text-slate-100">{u.name}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                        <td className="p-4 capitalize">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-slate-500/10 text-slate-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-450">{u.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
export default Dashboard;
