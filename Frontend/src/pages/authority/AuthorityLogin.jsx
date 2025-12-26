import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ShieldCheck, Lock, Fingerprint, ArrowRight, Home } from "lucide-react";

function AuthorityLogin() {
  const [authorityId, setAuthorityId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        authorityId,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name || "Authority");
      localStorage.setItem("role", "Authority");
      navigate("/auth/complaints");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:border-indigo-500/30">
          
          {/* Top Security Banner */}
          <div className="bg-indigo-600/20 py-3 px-6 border-b border-indigo-500/20 flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Secure Admin Access</span>
            <ShieldCheck size={16} className="text-indigo-400" />
          </div>

          <div className="p-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white tracking-tight">Authority Login</h2>
              <p className="text-zinc-500 text-sm mt-2">Access the administration control panel</p>
            </div>

            <form onSubmit={login} className="space-y-6">
              {/* Authority ID Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Personnel ID</label>
                <div className="relative group">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Enter ID"
                    value={authorityId}
                    onChange={(e) => setAuthorityId(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-zinc-700 font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Security Key</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group"
              >
                Authorize Access
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-zinc-800 text-center">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors mx-auto text-sm font-medium cursor-pointer"
              >
                <Home size={16} />
                <span>Return to Role Selection</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-zinc-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
          Classified Information • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}

export default AuthorityLogin;