import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Home, 
  Info, 
  MapPin, 
  Tag, 
  Clock, 
  FileText 
} from "lucide-react";

function IndivisualComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/auth/complaints/${id}`);
        setComplaint(res.data.complaint);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Failed to load complaint");
        navigate("/auth/complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id, navigate]);

  const approveComplaint = async () => {
    try {
      await api.put(`/auth/complaints/${id}/approve`);
      alert("Complaint Approved");
      navigate(`/auth/complaints/${id}/assign`);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Approval failed");
    }
  };

  const rejectComplaint = async () => {
    try {
      await api.put(`/auth/complaints/${id}/reject`);
      alert("Complaint Rejected");
      navigate("/auth/complaints");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Rejection failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!complaint) return <div className="p-20 text-center text-zinc-500">No Complaint Found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate("/auth/complaints")}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Management Hub</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Review <span className="text-indigo-500">Complaint</span></h1>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${
            complaint.approvalStatus === "pending" 
            ? "bg-amber-500/10 text-amber-400 border-amber-400/20" 
            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          }`}>
            Status: {complaint.approvalStatus}
          </div>
        </div>

        {/* Info Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-5 shadow-2xl">
            <h3 className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <Info size={14} /> Submission Info
            </h3>
            <div className="space-y-4">
              <DetailBox icon={<MapPin size={18}/>} label="Hostel / Location" value={complaint.hostelname} />
              <DetailBox icon={<Home size={18}/>} label="Room Number" value={complaint.roomnumber} />
              <DetailBox icon={<Tag size={18}/>} label="Category" value={complaint.category} />
              <DetailBox icon={<Clock size={18}/>} label="Submitted" value={new Date(complaint.createdAt).toLocaleString()} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 shadow-2xl h-full flex flex-col">
            <h3 className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <FileText size={14} /> Description
            </h3>
            <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex-1">
              {complaint.description}
            </p>
          </div>
        </div>

        {/* DECISION ACTION BAR */}
        {complaint.approvalStatus === "pending" && (
          <div className="bg-zinc-900 border-2 border-indigo-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(99,102,241,0.05)]">
            <div className="text-center md:text-left">
              <p className="text-white font-bold text-lg">Awaiting Authorization</p>
              <p className="text-zinc-500 text-sm">Please verify the details before proceeding.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={approveComplaint}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-900/20"
              >
                <CheckCircle2 size={18} /> Approve
              </button>

              <button
                onClick={rejectComplaint}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 font-bold py-3 px-8 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Detail Row
function DetailBox({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-1 text-zinc-600 group-hover:text-indigo-400 transition-colors">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">{label}</p>
        <p className="text-sm font-medium text-zinc-200">{value || "N/A"}</p>
      </div>
    </div>
  );
}

export default IndivisualComplaint;