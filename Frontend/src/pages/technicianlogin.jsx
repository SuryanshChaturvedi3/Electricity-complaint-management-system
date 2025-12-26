import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Wrench, Mail, Lock, LogIn, Home, Eye, EyeOff } from "lucide-react";

function TechnicianLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
  e.preventDefault();
  try {
    const res = await api.post("/technician/login", { email, password });
    
    // 1. Save the token (Crucial for the Dashboard API to work)
    localStorage.setItem("token", res.data.token); 
    localStorage.setItem("userName", res.data.name);
    localStorage.setItem("role", "Technician");

    // 2. Trigger the move
    console.log("Login success, navigating...");
    navigate("/tech/complaints"); // Ensure this path matches App.jsx exactly
    
  } catch (err) {
    console.error("Login Error:", err);
    alert("Invalid Credentials");
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md z-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:border-amber-500/30">
          <div className="bg-amber-500/10 py-3 px-6 border-b border-amber-500/20 flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Service Personnel Access</span>
            <Wrench size={14} className="text-amber-500" />
          </div>

          <div className="p-8 lg:p-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Wrench className="text-amber-500" size={30} />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Tech Login</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="name@voltfix.com"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all placeholder:text-zinc-700" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-12 py-3.5 rounded-xl outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all placeholder:text-zinc-700" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ✅ Button fixed: removed incorrect onClick */}
              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-amber-900/20 cursor-pointer mt-8"
              >
                <LogIn size={20} />
                START SESSION
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
              <button onClick={() => navigate("/")} className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors mx-auto text-xs font-bold uppercase tracking-widest cursor-pointer">
                <Home size={16} />
                <span>Main Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnicianLogin;