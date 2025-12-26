import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardList, 
  ExternalLink, 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon,
  CircleDot
} from "lucide-react";

function AuthorityDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/auth/complaints");
        setComplaints(Array.isArray(res.data) ? res.data : res.data.complaints || []);
      } catch (err) {
        console.error("FETCH ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "approved": return "text-indigo-400 bg-indigo-400/10 border-indigo-400/20";
      case "resolved": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      default: return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Management Hub</h1>
          <p className="text-zinc-500 mt-1">Review and authorize incoming student complaints.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button className="p-2 bg-zinc-800 text-white rounded-lg"><ListIcon size={18} /></button>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors"><LayoutGrid size={18} /></button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 py-4 border-y border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            placeholder="Search by Roll No or Category..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-indigo-500 transition-all outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-500 text-sm animate-pulse">Synchronizing database...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-20 text-center">
            <ClipboardList size={48} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-400 font-medium">No complaints requiring attention</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Student Roll No</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Student Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {complaints.map((c) => (
                  <tr key={c._id} className="group hover:bg-zinc-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-indigo-400 font-medium">{c.rollnumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-indigo-400 font-medium">{c.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        <span className="text-zinc-300 font-medium">{c.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(c.approvalStatus)}`}>
                        <CircleDot size={10} />
                        {c.approvalStatus?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.approvalStatus?.toLowerCase() === "pending" ? (
                        <button
                          onClick={() => navigate(`/auth/complaints/${c._id}`)}
                          className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-lg shadow-indigo-900/20"
                        >
                          Review <ExternalLink size={14} />
                        </button>
                      ) : (
                        <button 
                           onClick={() => navigate(`/auth/complaints/${c._id}`)}
                           className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs font-medium"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold px-2">
        <span>System Status: Operational</span>
        <span>Total Records: {complaints.length}</span>
      </div>
    </div>
  );
}

export default AuthorityDashboard;