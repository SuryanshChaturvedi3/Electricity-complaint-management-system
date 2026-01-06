import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
// Layout
import MainLayout from "./components/layout/MainLayout";



// Student Pages
import Login from "./pages/student/Login";
import Signup from "./pages/student/Signup";
import Dashboard from "./pages/student/Dashboard";
import RaiseComplaint from "./pages/student/RaiseComplaint";
import MyComplaints from "./pages/student/MyComplaint";

// Authority Pages
import AuthorityLogin from "./pages/authority/AuthorityLogin";
import AuthorityDashboard from "./pages/authority/AuthorityDashboard";
import IndivisualComplaint from "./pages/authority/IndivisualComplaint";
import AssignTechnician from "./pages/authority/AssignTechnician";

// Technician Pages
import TechnicianLogin from "./pages/technicianlogin";
import TechnicianDashboard from "./pages/techdashboard";
import ComplaintDetail from "./pages/ComplaintDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root */}
         <Route path="/" element={<LandingPage />} />

        {/* Auth pages (no layout) */}
        <Route path="/student/login" element={<Login />} />
        <Route path="/student/signup" element={<Signup />} />
        <Route path="/auth/login" element={<AuthorityLogin />} />
        <Route path="/tech/login" element={<TechnicianLogin />} />

        {/* Student portal */}
        <Route path="/student" element={<MainLayout role="Student" />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="complaint" element={<RaiseComplaint />} />
          <Route path="complaints" element={<MyComplaints />} />
        </Route>

        {/* Authority portal */}
        <Route path="/auth" element={<MainLayout role="Authority" />}>
          <Route index element={<Navigate to="complaints" />} />
          <Route path="complaints" element={<AuthorityDashboard />} />
          <Route path="complaints/:id" element={<IndivisualComplaint />} />
          <Route path="complaints/:id/assign" element={<AssignTechnician />} />
        </Route>

        {/* Technician portal */}
        <Route path="/tech" element={<MainLayout role="Technician" />}>
          <Route index element={<Navigate to="complaints" />} />
          <Route path="complaints" element={<TechnicianDashboard />} />
          <Route path="complaints/:id" element={<ComplaintDetail />} />
            
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
