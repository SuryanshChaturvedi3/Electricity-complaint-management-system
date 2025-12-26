import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  Tag, 
  Calendar,
  Wrench
} from "lucide-react";

function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const res = await api.get(`/technician/complaints/${id}`);
        const complaintData = res.data.complaint || res.data;
        setComplaint(complaintData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaint();
  }, [id]);

  async function handleResolve() {
    try {
      await api.put(`/technician/complaints/${id}/resolve`);
      alert("Job marked as resolved.");
      navigate("/technician/complaints"); // Redirect to correct dashboard path
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error: Could not update status.");
    }
  }

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!complaint) return (
    <div className="p-10 text-center text-zinc-500">No ticket data available.</div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/technician/complaints")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Back to Jobs</span>
        </button>
        
        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
          complaint.approvalStatus === 'resolved' 
          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        }`}>
          {complaint.approvalStatus}
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-zinc-800 bg-zinc-950/50">
          <h1 className="text-2xl font-bold text-white mb-2">Job Order Details</h1>
          <p className="text-zinc-500 font-mono text-xs">REF-ID: {id}</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1 */}
          <div className="space-y-4">
            <InfoItem icon={<MapPin size={16}/>} label="Location" value={`${complaint.hostelname}, Room ${complaint.roomnumber}`} />
            <InfoItem icon={<User size={16}/>} label="Student Roll" value={complaint.rollnumber} />
            <InfoItem icon={<Tag size={16}/>} label="Issue Category" value={complaint.category} isHighlighted />
            <InfoItem icon={<Calendar size={16}/>} label="Reported At" value={new Date(complaint.createdAt).toLocaleString()} />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <InfoItem icon={<Wrench size={16}/>} label="Warden Name" value={complaint.wardenname} />
            <InfoItem icon={<Clock size={16}/>} label="Resolution Time" value={complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : "Awaiting Fix"} />
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 mt-4">
               <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Issue Description</p>
               <p className="text-sm text-zinc-300 leading-relaxed italic">"{complaint.description}"</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 bg-zinc-950/50 border-t border-zinc-800">
          {complaint.approvalStatus !== "resolved" ? (
            <button
              onClick={handleResolve}
              className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-amber-900/20 cursor-pointer"
            >
              <CheckCircle size={20} />
              COMPLETE JOB & RESOLVE
            </button>
          ) : (
            <div className="flex items-center gap-3 text-emerald-500 font-bold">
              <CheckCircle size={24} />
              <span>This job has been marked as completed.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple Helper Component
function InfoItem({ icon, label, value, isHighlighted = false }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-zinc-600">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className={`text-sm font-semibold ${isHighlighted ? 'text-amber-500' : 'text-zinc-200'}`}>{value}</p>
      </div>
    </div>
  );
}

export default ComplaintDetail;