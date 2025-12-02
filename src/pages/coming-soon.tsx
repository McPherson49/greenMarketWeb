"use client";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null; // Prevent duplicate mount animation in StrictMode

  return (
    <div
      className="fixed inset-0 z-50 mt-20 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-[32px] bg-white/10"></div>
      <div
        className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-white/30 animate-modalShow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-all duration-200 z-10 p-1.5 rounded-full hover:bg-white/60 backdrop-blur-sm"
          aria-label="Close"
        >
          <IoIosCloseCircleOutline size={26} />
        </button>

        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#39B54A]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 right-1/2 translate-x-1/2 w-32 h-32 bg-[#39B54A]/10 rounded-full blur-3xl"></div>

        <div className="relative text-center pt-20 pb-14 px-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-28 bg-gradient-to-br from-[#39B54A]/20 to-[#2E8B57]/20 rounded-3xl flex items-center justify-center shadow-lg border border-[#39B54A]/30 animate-glow">
              <FaCheckCircle className="text-[#39B54A] text-7xl drop-shadow-xl" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
            Payment Successful
          </h2>

          <p className="text-gray-700 text-lg mb-10 leading-relaxed max-w-sm mx-auto">
            Your transaction has been securely processed.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#39B54A] to-[#2E8B57] hover:opacity-90 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 relative overflow-hidden"
          >
            <span className="relative z-10">Continue</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmerSlow"></div>
          </button>
        </div>
      </div>

      <style jsx>{` 
        @keyframes modalShow {
          0% { opacity: 0; transform: translateY(20px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modalShow { animation: modalShow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(57,181,74,0.3); }
          50% { box-shadow: 0 0 40px rgba(57,181,74,0.5); }
        }
        .animate-glow { animation: glow 2.5s ease-in-out infinite; }

        @keyframes shimmerSlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmerSlow { animation: shimmerSlow 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default function Demo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-[#39B54A] to-[#2E8B57] hover:opacity-90 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Show Payment Modal
      </button>

      <PaymentSuccessModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
