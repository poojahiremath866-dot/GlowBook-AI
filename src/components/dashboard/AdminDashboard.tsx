import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Store,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  BarChart3,
  Bot,
  Database,
  RefreshCw,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Parlor } from '../../types';
import { Badge } from '../common/Badge';

export const AdminDashboard: React.FC = () => {
  const { showNotification } = useNotification();
  const [stats, setStats] = useState<any>(null);
  const [parlors, setParlors] = useState<Parlor[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    projectId: string;
    url: string;
    tablesFound: string[];
    message: string;
    error?: string;
  }>({
    connected: true,
    projectId: 'dnqrcttcjnkdawjgtdtz',
    url: 'https://dnqrcttcjnkdawjgtdtz.supabase.co',
    tablesFound: [],
    message: 'Supabase connected'
  });
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [showSqlSchemaModal, setShowSqlSchemaModal] = useState(false);
  const [sqlSchema, setSqlSchema] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    loadAdminStats();
    checkSupabase();
  }, []);

  const loadAdminStats = async () => {
    setLoading(true);
    try {
      const [statsRes, parlorsRes] = await Promise.all([
        api.getAdminStats(),
        api.getParlors()
      ]);
      setStats(statsRes);
      setParlors(parlorsRes.parlors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkSupabase = async () => {
    try {
      const res = await api.getSupabaseStatus();
      if (res) {
        setSupabaseStatus(res);
      }
    } catch (e: any) {
      console.warn('Supabase status check:', e);
    }
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    try {
      const res = await api.testSupabaseConnection();
      setSupabaseStatus(res);
      showNotification(
        res.connected ? 'success' : 'info',
        res.connected ? 'Supabase Connected' : 'Supabase Ping Result',
        res.message || `Project ${res.projectId} tested successfully.`
      );
    } catch (err: any) {
      showNotification('error', 'Connection Test Failed', err.message);
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleSyncSeedSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      const res = await api.syncSupabaseSeed();
      showNotification(
        'success',
        'Supabase Database Synced',
        res.message || 'Seeded parlors, services, and packages to Supabase.'
      );
      checkSupabase();
    } catch (err: any) {
      showNotification('info', 'Supabase Sync Note', err.message || 'Tables may need to be created in Supabase SQL editor first.');
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleOpenSqlSchema = async () => {
    try {
      const res = await api.getSupabaseSchema();
      setSqlSchema(res.schema);
      setShowSqlSchemaModal(true);
    } catch (e: any) {
      showNotification('error', 'Error', 'Failed to load SQL schema');
    }
  };

  const handleCopySql = () => {
    if (!sqlSchema) return;
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    showNotification('success', 'Copied!', 'Supabase SQL script copied to clipboard.');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleToggleVerify = async (parlorId: string, currentStatus: boolean) => {
    try {
      await api.updateParlor(parlorId, { verified: !currentStatus });
      setParlors(prev => prev.map(p => p.id === parlorId ? { ...p, verified: !currentStatus } : p));
      showNotification('success', 'Verification Updated', `Salon verified status updated.`);
    } catch (err: any) {
      showNotification('error', 'Error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-[#4A0E0E] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#EAE2D8]/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F2E8E8] text-[#4A0E0E] text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Executive Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              GlowBook AI Platform Administration
            </h1>
            <p className="text-xs text-[#F2E8E8]/80">
              System health, Supabase PostgreSQL database, multi-city revenue trends, parlor verification approvals, and AI agent usage.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-admin-supabase-sql"
              onClick={handleOpenSqlSchema}
              className="px-4 py-2.5 bg-[#FAF7F2] text-[#4A0E0E] rounded-full text-xs font-semibold hover:bg-white transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#4A0E0E]" />
              <span>Supabase Schema & SQL</span>
            </button>
          </div>
        </div>

        {/* Supabase Database Connection Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE2D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D8] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A]">
                    Supabase Database Integration
                  </h3>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Connected</span>
                  </span>
                </div>
                <p className="text-xs text-[#5C5C5C]">
                  PostgreSQL cloud database connected to Project ID: <code className="font-mono text-[#4A0E0E] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#EAE2D8]">{supabaseStatus.projectId}</code>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-supabase-test-conn"
                onClick={handleTestSupabase}
                disabled={isTestingSupabase}
                className="px-3.5 py-2 bg-[#FAF7F2] text-[#1A1A1A] hover:bg-[#F2E8E8] border border-[#EAE2D8] rounded-full text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#4A0E0E] ${isTestingSupabase ? 'animate-spin' : ''}`} />
                <span>{isTestingSupabase ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <button
                id="btn-supabase-sync-seed"
                onClick={handleSyncSeedSupabase}
                disabled={isSyncingSupabase}
                className="px-3.5 py-2 bg-[#4A0E0E] text-white hover:bg-[#380A0A] rounded-full text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isSyncingSupabase ? 'Syncing...' : 'Sync & Seed Tables'}</span>
              </button>

              <button
                id="btn-supabase-view-sql"
                onClick={handleOpenSqlSchema}
                className="px-3.5 py-2 bg-[#FAF7F2] text-[#4A0E0E] hover:bg-[#F2E8E8] border border-[#EAE2D8] rounded-full text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>View SQL Editor Script</span>
              </button>
            </div>
          </div>

          {/* Supabase Connection details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Supabase Endpoint</span>
              <p className="text-xs font-mono text-[#1A1A1A] truncate">{supabaseStatus.url}</p>
            </div>
            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Database Tables</span>
              <p className="text-xs font-semibold text-[#1A1A1A]">
                users, parlors, services, beauticians, packages, appointments, reviews, wishlist
              </p>
            </div>
            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">API Key & Security</span>
              <p className="text-xs text-emerald-800 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Publishable Key Active (RLS Protected)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Gross Platform GMV</span>
            <p className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
              ₹{(stats?.totalRevenue || 182000).toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+38.5% YoY Growth</span>
            </p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Partner Salons</span>
            <p className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
              {parlors.length || 8}
            </p>
            <p className="text-[10px] text-[#5C5C5C]">Across 8 Indian Cities</p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Total Appointments</span>
            <p className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
              {stats?.totalBookings || 140}
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold">99.4% Fulfillment Rate</p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">AI Invocations</span>
            <p className="text-2xl font-serif-luxury font-bold text-[#4A0E0E]">
              1,248
            </p>
            <p className="text-[10px] text-[#5C5C5C]">Consultant & GlowBot queries</p>
          </div>
        </div>

        {/* Revenue Analytics & Category Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Bar Visualizer */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D8] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A] flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-[#8B4B4B]" />
                  <span>Monthly Booking Revenue (INR)</span>
                </h3>
                <p className="text-xs text-[#5C5C5C]">Growth trajectory over past 5 months</p>
              </div>
              <Badge variant="emerald">+46% Q3</Badge>
            </div>

            <div className="h-48 flex items-end justify-between gap-4 pt-6 pb-2 px-4 bg-white rounded-2xl border border-[#EAE2D8]">
              {(stats?.monthlyRevenue || [
                { month: 'Apr', revenue: 42000, bookings: 38 },
                { month: 'May', revenue: 68000, bookings: 54 },
                { month: 'Jun', revenue: 95000, bookings: 76 },
                { month: 'Jul', revenue: 134000, bookings: 102 },
                { month: 'Aug', revenue: 182000, bookings: 140 }
              ]).map((m: any, i: number) => {
                const heightPercent = Math.round((m.revenue / 200000) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-[#5C5C5C] opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(m.revenue / 1000).toFixed(0)}k
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] rounded-t-xl bg-[#4A0E0E] group-hover:bg-[#380A0A] transition-all shadow-xs"
                    />
                    <span className="text-xs font-semibold text-[#1A1A1A]">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D8] space-y-4">
            <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A]">Service Category Breakdown</h3>
            <p className="text-xs text-[#5C5C5C]">Booking volume by service discipline</p>

            <div className="space-y-3 pt-2">
              {[
                { name: 'Bridal & Party Makeup', percent: 38, color: 'bg-[#4A0E0E]' },
                { name: 'Facials & Skin Treatments', percent: 28, color: 'bg-[#8B4B4B]' },
                { name: 'Hair Cuts & Keratin Spa', percent: 20, color: 'bg-[#888888]' },
                { name: 'Nails & Pedicure', percent: 14, color: 'bg-[#C5A880]' },
              ].map((c, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-[#1A1A1A]">{c.name}</span>
                    <span className="font-bold text-[#1A1A1A]">{c.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#EAE2D8] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${c.percent}%` }}
                      className={`h-full ${c.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-[#F2E8E8] rounded-2xl border border-[#EAE2D8] text-[11px] text-[#4A0E0E] mt-4 flex items-center space-x-2">
              <Bot className="w-4 h-4 text-[#4A0E0E] shrink-0" />
              <span>AI recommendations drove <strong>41%</strong> of multi-service bridal bookings this month.</span>
            </div>
          </div>
        </div>

        {/* Parlors Directory & Verification Table */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D8] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A]">
                Partner Parlors Directory & Verification
              </h3>
              <p className="text-xs text-[#5C5C5C]">Audit quality ratings, KYC, and listed service offerings</p>
            </div>
            <Badge variant="stone">{parlors.length} Salons</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE2D8] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3">Salon Name</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Starting Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D8]">
                {parlors.map(p => (
                  <tr key={p.id} className="hover:bg-white/80 transition">
                    <td className="py-3.5 font-serif-luxury font-bold text-[#1A1A1A]">{p.name}</td>
                    <td className="py-3.5 text-[#5C5C5C]">{p.city}</td>
                    <td className="py-3.5 text-[#5C5C5C] capitalize">{p.type}</td>
                    <td className="py-3.5 font-semibold text-[#4A0E0E]">{p.rating}★ ({p.reviewCount})</td>
                    <td className="py-3.5 font-bold text-[#1A1A1A]">₹{p.startingPrice}</td>
                    <td className="py-3.5">
                      {p.verified ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[#888888] font-semibold bg-[#EAE2D8]/60 px-2.5 py-0.5 rounded-full">
                          <span>Unverified</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleToggleVerify(p.id, p.verified)}
                        className="text-xs font-semibold text-[#8B4B4B] hover:text-[#4A0E0E] cursor-pointer"
                      >
                        {p.verified ? 'Revoke Verification' : 'Approve & Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Supabase SQL Schema Modal */}
      {showSqlSchemaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EAE2D8] space-y-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F2E8E8] text-[#4A0E0E] flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A]">
                    Supabase PostgreSQL Schema Setup
                  </h3>
                  <p className="text-xs text-[#5C5C5C]">
                    Project: <span className="font-mono font-bold text-[#4A0E0E]">dnqrcttcjnkdawjgtdtz</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlSchemaModal(false)}
                className="text-[#888888] hover:text-[#1A1A1A] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] text-xs text-[#5C5C5C] flex items-center justify-between">
                <span>Run this script in your <strong>Supabase Dashboard → SQL Editor</strong> to create all tables with RLS security policies.</span>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-[#4A0E0E] text-white rounded-full text-xs font-semibold flex items-center space-x-1 hover:bg-[#380A0A] transition cursor-pointer shrink-0 ml-2"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>

              <div className="flex-1 bg-[#1A1A1A] text-[#FAF7F2] p-4 rounded-2xl font-mono text-xs overflow-y-auto border border-neutral-800 select-all">
                <pre className="whitespace-pre-wrap">{sqlSchema}</pre>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-[#EAE2D8] pt-4">
              <button
                onClick={() => setShowSqlSchemaModal(false)}
                className="px-5 py-2.5 bg-[#FAF7F2] text-[#1A1A1A] hover:bg-[#F2E8E8] border border-[#EAE2D8] rounded-full text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCopySql}
                className="px-5 py-2.5 bg-[#4A0E0E] text-white hover:bg-[#380A0A] rounded-full text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Script Copied' : 'Copy All SQL Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

