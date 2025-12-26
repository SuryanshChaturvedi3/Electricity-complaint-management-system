import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Calendar, Tag, ChevronRight } from "lucide-react";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/student/complaints")
      .then(res => {
        setComplaints(res.data.complaints || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper function to style status badges
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 group cursor-pointer"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold tracking-tight">Complaint <span className="text-blue-500">History</span></h1>
            <p className="text-zinc-500 mt-2">Track the progress and status of your reported issues.</p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Filed</p>
              <p className="text-xl font-bold">{complaints.length}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-950 rounded-full mb-6 border border-zinc-800">
              <AlertCircle className="text-zinc-700" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-300">No complaints found</h3>
            <p className="text-zinc-500 mt-2">You haven't raised any complaints yet.</p>
            <button 
              onClick={() => navigate("/student/complaint")}
              className="mt-6 text-blue-500 font-bold hover:underline"
            >
              Raise your first complaint
            </button>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800">
                    <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Created Date</th>
                    <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-zinc-700 transition-colors">
                            <Tag size={16} className="text-blue-400" />
                          </div>
                          <span className="font-medium text-zinc-200">{c.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(c.approvalStatus)}`}>
                          {c.approvalStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Calendar size={14} />
                          {new Date(c.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all cursor-pointer">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;