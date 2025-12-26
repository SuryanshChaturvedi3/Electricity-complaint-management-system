import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, History, LogOut, ShieldCheck, Zap } from "lucide-react";

const MainLayout = ({ role }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // SIMPLEST WAY: Get name directly from localStorage or default to "User"
  const userName = localStorage.getItem("userName") || "Student";

  const menuItems = {
    Student: [
      { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
      { name: "Raise Complaint", path: "/student/complaint", icon: PlusCircle },
      { name: "My History", path: "/student/complaints", icon: History },
    ],
    Authority: [
      { name: "Overview", path: "/auth/complaints", icon: ShieldCheck },
    ]
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login");
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar - Solid Dark Grey */}
      <aside className="w-64 border-r border-zinc-500 bg-zinc-950 sticky top-0 h-screen hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 font-bold text-xl text-blue-500 italic">
          <Zap className="fill-current" />
          <span>VoltFix</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems[role]?.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-zinc-500 bg-slate/50 backdrop-blur-md sticky top-0 z-10 flex items-center px-8 justify-between">
          <h2 className="font-semibold text-blue-500 text-sm tracking-widest">{role.toUpperCase()} PORTAL</h2>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                {/* Simplified Name Display */}
                <p className="text-sm font-bold text-white">{userName}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Verified User</p>
             </div>
             <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-blue-500">
                {userName.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>
        
        <main className="p-8 bg-black min-h-[calc(100vh-4rem)]">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default MainLayout;