import { useState } from "react";
import { auth } from "../firebase/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Phone, ShieldCheck, ArrowLeft, RefreshCw, Send } from "lucide-react";

const ForgotPassword = ({ onBack }) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Send Phone, 2: Verify OTP
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    const token = localStorage.getItem("resetToken");
    if (!token) return alert("No reset token found. Please verify your identity again."); 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/student/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword }),
      });
      if (response.ok) {
        alert("Password reset successful!");
        onBack();
      
        setShowResetModal(false);
        localStorage.removeItem("resetToken");
      } else {
        alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  const sendOTP = async () => {
    if (mobile.length < 10) return alert("Enter valid mobile number");
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formatPh = "+91" + mobile;
      
      window.confirmationResult = await signInWithPhoneNumber(auth, formatPh, appVerifier);
      setStep(2);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      const token = await user.getIdToken();
      console.log("Firebase Token:", token);
      alert("Verification Successful! You can now reset your password.");
       localStorage.setItem("resetToken", token);
  setShowResetModal(true); // 👈 popup open
      // Navigate to a new password input screen or handle logic here
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {step === 1 ? "Reset Password" : "Verify Identity"}
        </h2>
        <p className="text-slate-400 text-sm">
          {step === 1 
            ? "Enter your registered mobile to receive an OTP" 
            : `Code sent to +91 ******${mobile.slice(-4)}`}
        </p>
      </div>

      <div className="space-y-4">
        {step === 1 ? (
          /* Step 1: Mobile Input */
          <div className="space-y-2">
            <div className="relative group">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                size={18}
              />
              <input
                className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
              Send OTP
            </button>
          </div>
        ) : (
          /* Step 2: OTP Input */
          <div className="space-y-2">
            <div className="relative group">
              <ShieldCheck
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                size={18}
              />
              <input
                className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all tracking-[0.5em] font-bold text-center"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              Verify OTP
            </button>
            <button 
              onClick={() => setStep(1)} 
              className="w-full text-xs text-slate-500 hover:text-slate-300 py-2 transition-colors"
            >
              Change phone number?
            </button>
          </div>
        )}
      </div>

      {/* Required for Firebase Invisible Recaptcha */}
      <div id="recaptcha-container"></div>
      {showResetModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-96">
      <h3 className="text-lg font-bold mb-3">Reset Password</h3>

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border p-2 mb-3"
      />

      <button
        onClick={resetPassword}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Save Password
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ForgotPassword;