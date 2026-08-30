import { useState } from 'react';
import { 
  Trash2, 
  RefreshCw, 
  FileText, 
  AlertCircle, 
  Search, 
  Filter, 
  Calendar,
  Layers
} from 'lucide-react';

export default function AdminDocumentTable({ 
  documents, 
  loading, 
  onDelete, 
  onReprocess,
  onUpdateMetadata
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Filter local document listings
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || doc.category === categoryFilter;
    const matchesDept = deptFilter === '' || doc.department === deptFilter;
    const matchesStatus = statusFilter === '' || doc.status === statusFilter;

    return matchesSearch && matchesCategory && matchesDept && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'READY':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-450 border border-emerald-900/40">
            Ready
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 animate-pulse">
            Processing
          </span>
        );
      case 'UPLOADED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/60 text-slate-400 border border-slate-800">
            Uploaded
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/40 text-rose-400 border border-rose-900/40">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by title or filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-450 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">All Categories</option>
            <option value="Admissions">Admissions</option>
            <option value="Academics">Academics</option>
            <option value="Fees">Fees</option>
            <option value="Hostel">Hostel</option>
            <option value="Library">Library</option>
            <option value="Placement">Placement</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-450 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">All Departments</option>
            <option value="General">General</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Registrar Office">Registrar Office</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-450 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">All Statuses</option>
            <option value="READY">Ready</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-550 text-[10px] font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Document Details</th>
                <th className="px-6 py-4">Category & Dept</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Chunks</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                // Table skeleton loader
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5">
                      <div className="h-4 bg-slate-800 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-slate-800 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 bg-slate-800 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-slate-800 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-6 bg-slate-800 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 bg-slate-800 rounded w-8"></div>
                    </td>
                    <td className="px-6 py-5"></td>
                  </tr>
                ))
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-10 h-10 mx-auto text-slate-700 mb-3" />
                    <p className="text-sm font-medium">No documents found matching filters</p>
                    <p className="text-xs text-slate-650 mt-1">Upload a PDF or DOCX file to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-900/40 transition-colors">
                    {/* Document Title & File Info */}
                    <td className="px-6 py-5">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-850 text-indigo-400 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{doc.title}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{doc.originalName}</p>
                          {doc.status === 'FAILED' && doc.errorMessage && (
                            <div className="mt-2 text-[10px] text-rose-450 bg-rose-950/20 border border-rose-900/30 rounded px-2.5 py-1.5 flex items-start space-x-1.5 max-w-sm">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              <span>{doc.errorMessage}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category & Dept */}
                    <td className="px-6 py-5 text-xs">
                      <span className="font-semibold text-slate-350">{doc.category}</span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{doc.department}</div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-5">{getStatusBadge(doc.status)}</td>

                    {/* Chunk counts */}
                    <td className="px-6 py-5 text-xs font-mono font-medium text-slate-400">
                      {doc.chunkCount || 0}
                    </td>

                    {/* Delete and reprocess operations */}
                    <td className="px-6 py-5 text-right">
                      <div className="inline-flex items-center space-x-2">
                        {/* Reprocess */}
                        <button
                          title="Reprocess text extraction"
                          onClick={() => onReprocess(doc._id)}
                          disabled={doc.status === 'PROCESSING'}
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-slate-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Delete */}
                        <button
                          title="Delete document and chunks"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${doc.title}"? This cannot be undone.`)) {
                              onDelete(doc._id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
