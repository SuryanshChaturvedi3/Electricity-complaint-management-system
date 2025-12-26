import { useNavigate } from "react-router-dom";
import { PlusCircle, ListChecks, Zap, Clock, CheckCircle, ArrowUpRight } from "lucide-react";

function StudentDashboard() {
  const navigate = useNavigate();

  // Mock data for the stats - in a real app, these would come from your API
  const stats = [
    { label: "Active Issues", count: 3, icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Pending", count: 1, icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Resolved", count: 8, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-8 bg-zinc-900/50 p-6 rounded-3xl">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="text-blue-500">Student</span>
            </h1>
            <p className="text-zinc-500 mt-2 font-medium">Manage your electricity complaints and track status in real-time.</p>
          </div>
          <div className="flex gap-3">
             <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <span className="text-xs font-bold text-zinc-400">ID: 402</span>
             </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center gap-5">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Raise Complaint Card */}
          <button 
            onClick={() => navigate("/student/complaint")}
            className="group relative text-left bg-zinc-900 border border-zinc-800 p-8 rounded-3xl transition-all duration-500 hover:border-blue-500/50 hover:bg-zinc-800/50 overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-6 text-zinc-800 group-hover:text-blue-500 transition-colors">
              <ArrowUpRight size={40} />
            </div>
            <div className="relative z-10">
              <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40 mb-6">
                <PlusCircle size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Raise New Complaint</h3>
              <p className="text-zinc-400 leading-relaxed max-w-xs">
                Experiencing a power cut or equipment failure? Submit a detailed report here.
              </p>
            </div>
          </button>

          {/* My History Card */}
          <button 
            onClick={() => navigate("/student/complaints")}
            className="group relative text-left bg-zinc-900 border border-zinc-800 p-8 rounded-3xl transition-all duration-500 hover:border-purple-500/50 hover:bg-zinc-800/50 overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-6 text-zinc-800 group-hover:text-purple-500 transition-colors">
              <ArrowUpRight size={40} />
            </div>
            <div className="relative z-10">
              <div className="bg-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/40 mb-6">
                <ListChecks size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-2">My Complaints</h3>
              <p className="text-zinc-400 leading-relaxed max-w-xs">
                View previous submissions, check tracking status, and read updates from technicians.
              </p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;