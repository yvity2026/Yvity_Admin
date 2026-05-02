"use client";

import { useState, useRef } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export function SettingsModal({ isOpen, onClose, title, icon, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-xl">{icon}</span>}
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F4F0] text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 pt-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function MobileModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1 = input, 2 = otp
  const [mobile, setMobile] = useState("");

  const handleClose = () => {
    setStep(1);
    setMobile("");
    onClose();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if(mobile.length >= 10) setStep(2);
  };

  return (
    <SettingsModal isOpen={isOpen} onClose={handleClose} title="Change Mobile" icon="📱">
      {step === 1 ? (
        <form onSubmit={handleSendOtp}>
          <div className="bg-[#EAF5F3] rounded-lg p-4 mb-6">
            <p className="text-[#0A4A4A] text-sm font-medium">Current : +91 9876543210</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              New Mobile Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]" 
              placeholder="Enter new 10-digit mobile" 
            />
          </div>
          
          <button type="submit" className="w-full bg-[#0A4A4A] text-white rounded-lg py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#083a3a] transition-colors cursor-pointer">
            Send OTP <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <OtpForm 
          onBack={() => setStep(1)} 
          onSubmit={handleClose} 
          backText="Change Number" 
        />
      )}
    </SettingsModal>
  );
}

export function EmailModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setStep(1);
    setEmail("");
    onClose();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if(email) setStep(2);
  };

  return (
    <SettingsModal isOpen={isOpen} onClose={handleClose} title="Change Email" icon="📧">
      {step === 1 ? (
        <form onSubmit={handleSendOtp}>
          <div className="bg-[#EAF5F3] rounded-lg p-4 mb-6">
            <p className="text-[#0A4A4A] text-sm font-medium">Current : user@example.com</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Enter New Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]" 
              placeholder="Enter Your Email" 
            />
          </div>
          
          <button type="submit" className="w-full bg-[#0A4A4A] text-white rounded-lg py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#083a3a] transition-colors cursor-pointer">
            Send Verification <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <OtpForm 
          onBack={() => setStep(1)} 
          onSubmit={handleClose} 
          backText="Change Email" 
        />
      )}
    </SettingsModal>
  );
}




export function PasswordModal({ isOpen, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation using toast
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password must match");
      return;
    }

    // success (for now)
    toast.success("Password updated successfully");

    handleClose();
  };

  return (
    <SettingsModal isOpen={isOpen} onClose={handleClose} title="Change Password" icon="🔒">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input 
              type="password"
              required
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]" 
              placeholder="Enter current password" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <input 
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]" 
              placeholder="Min 8 characters" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input 
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]" 
              placeholder="Repeat new password" 
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-[#0A4A4A] text-white rounded-lg py-3 font-semibold text-sm hover:bg-[#083a3a] transition-colors cursor-pointer"
        >
          Update Password
        </button>
      </form>
    </SettingsModal>
  );
}
function OtpForm({ onBack, onSubmit, backText }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== "" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Auto focus previous input on backspace
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.every(digit => digit !== "")) {
      onSubmit(otp.join(""));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <button 
        type="button" 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium mb-6 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> {backText}
      </button>

      <div className="mb-8 mt-2">
        <h3 className="text-[#0A4A4A] text-base font-medium text-center mb-6">Enter 4-digit OTP</h3>
        <div className="flex justify-center gap-3 sm:gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F8F6F1] border border-gray-200 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] focus:bg-white transition-all"
            />
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full bg-[#0A4A4A] text-white rounded-lg py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#083a3a] transition-colors mt-auto cursor-pointer"
        disabled={otp.some(digit => digit === "")}
      >
        Submit <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

export function DeactivateModal({ isOpen, onClose }) {
  const handleDeactivate = () => {
    // Logic to deactivate account
    onClose();
  };

  return (
    <SettingsModal isOpen={isOpen} onClose={onClose} title="Deactivate Account?">
      <p className="text-gray-500 text-[clamp(12px,1.2vw,15px)] leading-relaxed mb-6 font-medium">
        Your profile will be hidden from Public view. You can reactivate anytime by logging in. Your data will be preserved.
      </p>
      
      <div className="flex gap-4">
        <button 
          onClick={handleDeactivate}
          className="flex-1 py-3 bg-[#FEF2F2] border border-[#FECACA] text-[#D32323] rounded-lg font-bold text-sm hover:bg-[#FEE2E2] transition-colors cursor-pointer"
        >
          Deactivate
        </button>
        <button 
          onClick={onClose}
          className="flex-1 py-3 bg-[#0A4A4A] text-white rounded-lg font-bold text-sm hover:bg-[#083a3a] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </SettingsModal>
  );
}

export function DeleteModal({ isOpen, onClose }) {
  const [confirmText, setConfirmText] = useState("");

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (confirmText === "DELETE") {
      // Logic to delete account
      handleClose();
    }
  };

  return (
    <SettingsModal isOpen={isOpen} onClose={handleClose} title="Delete Account" icon="⚠️">
      <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 mb-6">
        <p className="text-[clamp(12px,1.2vw,14px)] text-[#D32323] leading-relaxed">
          <span className="font-bold">This is permanent and cannot be undone.</span> All your profile data, testimonials, achievements and subscription will be deleted.
        </p>
      </div>

      <form onSubmit={handleDelete}>
        <div className="mb-6">
          <label className="block text-[clamp(13px,1.3vw,15px)] font-bold text-gray-900 mb-2">
            Type "DELETE" to confirm
          </label>
          <input 
            type="text"
            required
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#D32323] focus:ring-1 focus:ring-[#D32323]" 
            placeholder="Type DELETE" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={confirmText !== "DELETE"}
          className={`w-full py-3 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
            confirmText === "DELETE" 
              ? "bg-[#DF3737] hover:bg-[#c72f2f] text-white" 
              : "bg-[#F3F4F6] text-gray-400 cursor-not-allowed"
          }`}
        >
          Permanently Delete Account
        </button>
      </form>
    </SettingsModal>
  );
}
