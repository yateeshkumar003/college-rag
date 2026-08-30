import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import api from '../../services/api';
import { 
  BarChart3, 
  Database, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  FolderOpen,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'READY':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'PROCESSING':
        return <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />;
      case 'FAILED':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-450" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard | CollegeRAG</title>
      </Head>

      <div className="space-y-8 max-w-5-xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2.5">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
              <span>Admin Analytics Control</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Real-time statistics for college document indexing and system health</p>
          </div>
          <Link href="/admin/documents">
            <span className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-650 hover:bg-indigo-600 text-white shadow-lg cursor-pointer transition-all active:scale-[0.98] space-x-2">
              <span>Manage Documents</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse space-y-3 h-28">
                <div className="h-3 bg-slate-800 rounded w-16"></div>
                <div className="h-6 bg-slate-800 rounded w-24"></div>
              </div>
            ))
          ) : (
            <>
              {/* Total Documents */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Files</span>
                <h3 className="text-2xl font-extrabold text-slate-100 mt-1">{stats.totalDocuments}</h3>
                <div className="absolute right-4 bottom-4 text-slate-800 group-hover:text-indigo-950/40 transition-colors">
                  <FolderOpen className="w-8 h-8" />
                </div>
              </div>

              {/* Ready */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Indexed READY</span>
                <h3 className="text-2xl font-extrabold text-emerald-450 mt-1">{stats.readyCount}</h3>
                <div className="absolute right-4 bottom-4 text-slate-800 group-hover:text-emerald-950/40 transition-colors">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>

              {/* Processing */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Processing</span>
                <h3 className="text-2xl font-extrabold text-indigo-400 mt-1">{stats.processingCount + stats.uploadedCount}</h3>
                <div className="absolute right-4 bottom-4 text-slate-800 group-hover:text-indigo-950/40 transition-colors">
                  <RefreshCw className="w-8 h-8" />
                </div>
              </div>

              {/* Failed */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Failed</span>
                <h3 className="text-2xl font-extrabold text-rose-400 mt-1">{stats.failedCount}</h3>
                <div className="absolute right-4 bottom-4 text-slate-800 group-hover:text-rose-950/40 transition-colors">
                  <AlertCircle className="w-8 h-8" />
                </div>
              </div>

              {/* Total Chunks */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Vector Chunks</span>
                <h3 className="text-2xl font-extrabold text-slate-100 mt-1">{stats.totalChunks}</h3>
                <div className="absolute right-4 bottom-4 text-slate-800 group-hover:text-indigo-950/40 transition-colors">
                  <Database className="w-8 h-8" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Uploads Table Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Recent Upload Activity</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-550 text-[10px] font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Document Title</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Chunks</th>
                  <th className="pb-3 text-right">Upload Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-350 text-xs">
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4"><div className="h-4 bg-slate-800 rounded w-48"></div></td>
                      <td className="py-4"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                      <td className="py-4"><div className="h-6 bg-slate-800 rounded-full w-16"></div></td>
                      <td className="py-4"><div className="h-4 bg-slate-800 rounded w-8"></div></td>
                      <td className="py-4"><div className="h-4 bg-slate-800 rounded w-24 ml-auto"></div></td>
                    </tr>
                  ))
                ) : stats.recentDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-550 text-xs">
                      No document uploads recorded yet. Go to document portal to upload files.
                    </td>
                  </tr>
                ) : (
                  stats.recentDocuments.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-slate-200">
                        {doc.title}
                        <div className="text-[10px] font-medium font-mono text-slate-550 mt-0.5">{doc.originalName}</div>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold text-slate-400">{doc.category}</td>
                      <td className="py-3.5 pr-4">
                        <span className="flex items-center space-x-1.5 font-semibold text-[10px]">
                          {getStatusIcon(doc.status)}
                          <span className={`${
                            doc.status === 'READY' ? 'text-emerald-450' : 
                            doc.status === 'PROCESSING' ? 'text-indigo-400 animate-pulse' :
                            doc.status === 'FAILED' ? 'text-rose-400' : 'text-slate-500'
                          }`}>
                            {doc.status}
                          </span>
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-bold text-slate-400">{doc.chunkCount || 0}</td>
                      <td className="py-3.5 text-right font-medium text-slate-550">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
