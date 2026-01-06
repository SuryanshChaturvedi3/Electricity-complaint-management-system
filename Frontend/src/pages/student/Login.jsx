import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import ForgotPassword from "../../pages/ResetPassword";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/student/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name || "Student");
      localStorage.setItem("role", res.data.role || "student");
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 transition-all duration-300 hover:border-slate-700">
        
        {/* Check if we should show Forgot Password or Login Form */}
        {showForgot ? (
          <ForgotPassword onBack={() => setShowForgot(false)} />
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 hover:bg-white/20 hover:scale-110 transition-all cursor-pointer border border-white/5 group"
                title="Switch Role"
              >
                <LogIn className="text-blue-400 group-hover:text-blue-300" size={24} />
              </button>

              <h2 className="text-3xl font-bold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-400 text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                    size={18}
                  />
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
                    type="email"
                    placeholder="name@university.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                    size={18}
                  />
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-right">
                  <span
                    className="text-sm text-blue-400 hover:underline cursor-pointer"
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              Login
            </button>

            <p className="text-center text-slate-500 text-sm">
              Don't have an account?{" "}
              <span
                className="text-blue-400 hover:underline cursor-pointer font-medium"
                onClick={() => navigate("/student/signup")}
              >
                Sign up
              </span>
            </p>
          </form>
         
        )}
          <div id="recaptcha"></div>
      </div>
    </div>
  );
}

export default StudentLogin;