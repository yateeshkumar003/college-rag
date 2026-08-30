import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import api from '../../services/api';
import AdminDocumentTable from '../../components/AdminDocumentTable';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileUp,
  Database
} from 'lucide-react';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Upload states
  const [uploadFile, setUploadFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Admissions');
  const [department, setDepartment] = useState('General');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef(null);

  // Fetch document lists
  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Poll for document status updates if any document is in PROCESSING status
  useEffect(() => {
    const hasProcessing = documents.some((doc) => doc.status === 'PROCESSING' || doc.status === 'UPLOADED');
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchDocuments();
    }, 4000);

    return () => clearInterval(interval);
  }, [documents]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      // Auto-populate Title with name of file without extension
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(baseName);
      setUploadError('');
      setUploadSuccess(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!uploadFile) {
      setUploadError('Please select a PDF or DOCX file to upload');
      return;
    }
    if (!title || !category || !department) {
      setUploadError('Please fill in all metadata fields');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('department', department);
    formData.append('description', description);

    try {
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess(true);
      setUploadFile(null);
      setTitle('');
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh listings
      await fetchDocuments();
    } catch (err) {
      const errMessage = err.response?.data?.message || 'Failed to upload document';
      setUploadError(errMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete document');
    }
  };

  const handleReprocess = async (id) => {
    try {
      // Optimistically update status to PROCESSING
      setDocuments(documents.map((doc) => {
        if (doc._id === id) {
          return { ...doc, status: 'PROCESSING' };
        }
        return doc;
      }));
      await api.post(`/documents/${id}/reprocess`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to trigger reprocessing');
      fetchDocuments();
    }
  };

  return (
    <>
      <Head>
        <title>Manage Knowledge Base | CollegeRAG Admin</title>
      </Head>

      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2.5">
              <Database className="w-6 h-6 text-indigo-400" />
              <span>Knowledge Base Management</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Upload institutional PDFs and DOCX files to configure vector similarity chunks</p>
          </div>
        </div>

        {/* Main Content Split: Form on Left, Table on Right (or top-to-bottom layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Upload Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-3 flex items-center space-x-2">
              <FileUp className="w-4.5 h-4.5 text-indigo-400" />
              <span>Upload Document</span>
            </h2>

            {/* Notification messages */}
            {uploadSuccess && (
              <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 text-xs flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Document uploaded and added to processing queue.</span>
              </div>
            )}

            {uploadError && (
              <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* File input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document File</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border border-dashed border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/10 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center space-y-2.5"
                >
                  <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  <div className="text-xs">
                    {uploadFile ? (
                      <span className="font-semibold text-slate-350 font-mono break-all px-2 block">{uploadFile.name}</span>
                    ) : (
                      <>
                        <span className="font-semibold text-indigo-400 hover:text-indigo-300">Click to upload</span> or drag and drop
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-550">PDF or DOCX (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Display Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hostel Timings Notice 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2.5 px-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-855 rounded-lg py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Academics">Academics</option>
                  <option value="Fees">Fees</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Library">Library</option>
                  <option value="Placement">Placement</option>
                </select>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-855 rounded-lg py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="General">General</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Registrar Office">Registrar Office</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                <textarea
                  rows="3"
                  placeholder="Optional summary or notes about the document contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2.5 px-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
              >
                {uploading ? (
                  <span className="w-4.5 h-4.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Upload & Process'
                )}
              </button>

            </form>
          </div>

          {/* Document Inventory Table */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-3 flex items-center space-x-2">
              <Database className="w-4.5 h-4.5 text-indigo-400" />
              <span>Document Inventory</span>
            </h2>

            <AdminDocumentTable
              documents={documents}
              loading={loading}
              onDelete={handleDelete}
              onReprocess={handleReprocess}
            />
          </div>

        </div>

      </div>
    </>
  );
}
