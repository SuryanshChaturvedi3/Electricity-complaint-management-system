import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { Wrench, MapPin, ClipboardList, ExternalLink, CircleDot, AlertTriangle } from "lucide-react";

function TechnicianDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/technician/complaints")
      .then(res => {
        setComplaints(res.data.complaints || res.data || []);
      })
      .catch(err => {
        console.log("Dashboard API error:", err.response?.status);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-400/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Wrench className="text-amber-500" />
            Field Dashboard
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">Manage and update your assigned electrical repairs.</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Jobs</p>
            <p className="text-xl font-bold text-white">{complaints.length}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <AlertTriangle className="mx-auto text-zinc-800" size={48} />
            <p className="text-zinc-500 font-medium">No tasks assigned to your profile yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800">
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">#</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Issue Description</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {complaints.map((c, index) => (
                  <tr key={c._id} className="hover:bg-zinc-800/40 transition-colors group">
                    <td className="px-6 py-5 text-zinc-500 font-mono text-sm">{index + 1}</td>
                    <td className="px-6 py-5">
                      <p className="text-zinc-200 text-sm line-clamp-1 max-w-xs">{c.description}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <MapPin size={14} className="text-amber-500/50" />
                        <span>{c.hostelname} • {c.roomnumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(c.approvalStatus)}`}>
                        <CircleDot size={10} />
                        {c.approvalStatus?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {/* FIXED PATH: Points to the technician route */}
                      <Link
                        to={`/tech/complaints/${c._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-amber-500 hover:text-black text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                      >
                        View Details
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] text-center font-bold">
        VoltFix Maintenance Management System
      </p>
    </div>
  );
}

export default TechnicianDashboard;