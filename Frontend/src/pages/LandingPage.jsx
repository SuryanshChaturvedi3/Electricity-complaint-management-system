import { useNavigate } from "react-router-dom";
import { User, ShieldCheck, Wrench, Zap, CheckCircle2, Globe, Shield, Clock } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const roles = [
    { 
      title: "Student", 
      path: "/student/login", 
      icon: User, 
      desc: "Report electrical issues in your hostel and track real-time resolution status.",
      color: "blue" 
    },
    { 
      title: "Authority", 
      path: "/auth/login", 
      icon: ShieldCheck, 
      desc: "Administrative control to verify, manage, and assign tasks to available staff.",
      color: "purple" 
    },
    { 
      title: "Technician", 
      path: "/tech/login", 
      icon: Wrench, 
      desc: "Access your field service queue and update job progress directly from site.",
      color: "amber" 
    }
  ];

  const features = [
    { icon: Clock, text: "24/7 Support" },
    { icon: Shield, text: "Secure Access" },
    { icon: CheckCircle2, text: "Real-time Tracking" },
    { icon: Globe, text: "Centralized Hub" }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -z-10" />

      {/* 1. Navbar / Top Badge */}
      <div className="mt-12 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          University Maintenance System v2.0
        </div>
      </div>

      {/* 2. Hero Header */}
      <div className="text-center max-w-3xl px-6 mb-16">
        <div className="flex justify-center mb-6 text-blue-500">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <Zap size={40} fill="currentColor" />
          </div>
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          One Portal. <br /> Total Maintenance.
        </h1>
        <p className="text-zinc-400 text-xl leading-relaxed">
          The official electrical complaint management system. Optimized for students, authorities, and field engineers to work in sync.
        </p>
      </div>

      {/* 3. Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-6 mb-20">
        {roles.map((role) => (
          <button
            key={role.title}
            onClick={() => navigate(role.path)}
            className="group relative bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem] transition-all duration-500 hover:border-zinc-600 hover:bg-zinc-900 text-left cursor-pointer overflow-hidden"
          >
            {/* Subtle Inner Glow on Hover */}
            <div className={`absolute inset-0 bg-${role.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className={`w-14 h-14 rounded-2xl bg-${role.color}-500/10 flex items-center justify-center mb-6 text-${role.color}-500 group-hover:scale-110 transition-transform duration-500 border border-${role.color}-500/20`}>
              <role.icon size={28} />
            </div>
            
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              {role.title}
              <CheckCircle2 size={16} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
            </h3>
            <p className="text-zinc-500 leading-relaxed text-sm mb-4">
              {role.desc}
            </p>
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">
              Access Portal →
            </div>
          </button>
        ))}
      </div>

      {/* 4. Features / Fullness Section */}
      <div className="w-full max-w-4xl px-6 py-12 border-t border-zinc-900 flex flex-wrap justify-center gap-x-12 gap-y-6 mb-12">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-2 text-zinc-500">
            <feat.icon size={18} className="text-blue-500/50" />
            <span className="text-sm font-medium tracking-tight">{feat.text}</span>
          </div>
        ))}
      </div>

      {/* 5. Minimal Footer */}
      <footer className="mb-12 text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">
        © VoltFix Technologies • Intelligent Infrastructure
      </footer>
    </div>
  );
};

export default LandingPage;