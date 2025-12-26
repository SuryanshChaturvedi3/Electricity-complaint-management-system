import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, UserPlus, ArrowRight } from "lucide-react";

function StudentSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/student/signup", form);
      alert("Signup successful");
      navigate("/student/login");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error during signup. Please try again.");
    }
  };

  const getIcon = (key) => {
    switch (key) {
      case "name": return <User size={18} />;
      case "email": return <Mail size={18} />;
      case "password": return <Lock size={18} />;
      case "mobileNumber": return <Phone size={18} />;
      default: return <UserPlus size={18} />;
    }
  };

  return (
    /* 1. Black Background */
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      
      {/* 2. Greyish Card with Shadow & Hover Effect */}
      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden transition-all duration-500 hover:border-slate-700 hover:shadow-blue-900/10">
        
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 w-full" />
        
        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-zinc-500 text-sm mt-2">Join the student electricity portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {Object.keys(form).map((key) => (
              <div key={key} className="space-y-2 text-left">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                    {getIcon(key)}
                  </div>
                  <input
                    name={key}
                    type={key === "password" ? "password" : "text"}
                    placeholder={`Your ${key}`}
                    onChange={handleChange}
                    required
                    /* 3. Dark Input Styling */
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/student/login")} 
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentSignup;