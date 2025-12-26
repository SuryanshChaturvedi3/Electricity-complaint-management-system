import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { 
  ArrowLeft, 
  UserPlus, 
  Mail, 
  Wrench, 
  Search, 
  UserCheck, 
  Shield 
} from "lucide-react";

function AssignTechnician() {
  const { id } = useParams();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/technicians")
      .then(res => {
        setTechnicians(res.data.technicians || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const assignTechnician = async (techId) => {
    try {
      await api.put(`/auth/complaints/${id}/assign`, {
        technicianId: techId,
      });
      alert("Technician Assigned Successfully");
      navigate("/auth/complaints");
    } catch (err) {
      console.error(err);
      alert("Failed to assign technician");
    }
  };

  // Filter technicians based on search input
  const filteredTechs = technicians.filter(tech => 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-4 cursor-pointer"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Detail</span>
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Assign <span className="text-indigo-500">Personnel</span></h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Complaint ID: {id}</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="Search staff by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Content Section */}
        {filteredTechs.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-20 text-center">
            <Wrench className="mx-auto text-zinc-800 mb-4" size={48} />
            <p className="text-zinc-500">No matching technicians found in the directory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechs.map(tech => (
              <div 
                key={tech._id} 
                className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/80 shadow-xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Shield size={28} />
                  </div>
                  <div className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 uppercase">
                    Available
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {tech.name}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                      <Mail size={14} />
                      <span>{tech.email}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => assignTechnician(tech._id)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-900/20 cursor-pointer"
                  >
                    <UserPlus size={18} />
                    Assign Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
           <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
             End of Technician Directory
           </p>
        </div>
      </div>
    </div>
  );
}

export default AssignTechnician;