import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Home, User, Hash, BookOpen, MessageSquare, ShieldAlert } from "lucide-react";

function RaiseComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hostelname: "",
    roomnumber: "",
    wardenname: "",
    rollnumber: "",
    branch: "",
    category: "Electrical",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.post("/student/complaint", formData);
      alert("Complaint raised successfully");
      navigate("/student/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error while raising complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation / Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Raise a <span className="text-blue-500">Complaint</span></h1>
          <p className="text-zinc-500 mt-2">Provide accurate details to ensure faster resolution by the technical team.</p>
        </div>

        {/* Main Form Card */}
        <form onSubmit={submitComplaint} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 w-full" />
          
          <div className="p-8 lg:p-10 space-y-8">
            
            {/* Grid for Personal/Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Hostel Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Hostel Name</label>
                <div className="relative group">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input name="hostelname" placeholder="e.g. Ramanujan Hall" onChange={handleChange} required 
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-700" />
                </div>
              </div>

              {/* Room Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Room Number</label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input name="roomnumber" placeholder="e.g. 302" onChange={handleChange} required 
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-700" />
                </div>
              </div>

              {/* Warden Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Warden Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input name="wardenname" placeholder="Enter warden name" onChange={handleChange} required 
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-700" />
                </div>
              </div>

              {/* Roll Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Roll Number</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input name="rollnumber" placeholder="e.g. CS21044" onChange={handleChange} required 
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-700" />
                </div>
              </div>
            </div>

            {/* Category and Branch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-800 pt-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Branch</label>
                <div className="relative group">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input name="branch" placeholder="e.g. CSE" onChange={handleChange} required 
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-700" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Category</label>
                <div className="relative group">
                  <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <select name="category" onChange={handleChange} 
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none">
                    <option className="bg-zinc-950">Electrical</option>
                    <option className="bg-zinc-950">Plumbing</option>
                    <option className="bg-zinc-950">Internet</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2 border-t border-zinc-800 pt-8">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Description of Issue</label>
              <div className="relative group">
                <MessageSquare className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <textarea name="description" placeholder="Describe the problem in detail..." onChange={handleChange} required rows="4"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-700 resize-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-900/20 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RaiseComplaint;