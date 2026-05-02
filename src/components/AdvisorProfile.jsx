"use client";
import React from "react";
import { X } from "lucide-react";

export default function AdvisorProfile({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white w-[460px] rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span>Advisor Profile</span>
          </div>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Top Section */}
        <div className="flex justify-between items-start px-5 py-4">
          
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-full bg-[#1f5f4a] flex items-center justify-center text-white font-semibold">
              KM
            </div>

            <div>
              <p className="text-[16px] font-semibold text-gray-900">
                Krishna Mohan
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Senior LIC Advisor • Nellore, AP
              </p>

              <div className="flex gap-2 flex-wrap">
                <span className="text-[11px] px-2 py-[2px] rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                  ★ Gold
                </span>
                <span className="text-[11px] px-2 py-[2px] rounded-full bg-green-100 text-green-700 border border-green-300">
                  ✓ IRDAI Verified
                </span>
                <span className="text-[11px] px-2 py-[2px] rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                  ● Active
                </span>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <p className="text-[30px] font-semibold text-gray-900">87</p>
            <p className="text-[11px] text-gray-400">YVITY Score</p>
          </div>
        </div>

        {/* Info Table */}
        <div className="px-5 py-3 border-t border-gray-100 border-b border-gray-100">
          <table className="w-full text-[13px]">
            <tbody className="space-y-1">
              <tr>
                <td className="text-gray-400 py-1">Mobile</td>
                <td className="text-gray-800 py-1">+91 9876543210</td>
                <td className="text-gray-400 py-1">Plan</td>
                <td>
                  <span className="text-[11px] px-2 py-[2px] rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                    ★ Gold +₹3,999/yr
                  </span>
                </td>
              </tr>

              <tr>
                <td className="text-gray-400 py-1">Email</td>
                <td className="text-gray-800 py-1">krishna@email.com</td>
                <td className="text-gray-400 py-1">Testimonials</td>
                <td className="text-gray-800 py-1">50</td>
              </tr>

              <tr>
                <td className="text-gray-400 py-1">City</td>
                <td className="text-gray-800 py-1">Nellore, AP</td>
                <td className="text-gray-400 py-1">Recommendations</td>
                <td className="text-gray-800 py-1">32</td>
              </tr>

              <tr>
                <td className="text-gray-400 py-1">IRDAI No.</td>
                <td className="text-gray-800 py-1">LIC-AP-****291</td>
                <td className="text-gray-400 py-1">Registered</td>
                <td className="text-gray-800 py-1">Jan 15, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Score Breakdown */}
        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase mb-3">
            Score Breakdown
          </p>

          <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
            
            {[
              { score: "28/30", label: "Identity" },
              { score: "26/30", label: "Visibility", highlight: true },
              { score: "33/40", label: "Trust" },
              { score: "87", label: "Total" },
            ].map((item) => (
              <div key={item.label}>
                <p
                  className={`text-[16px] font-semibold ${
                    item.highlight ? "text-yellow-600" : "text-gray-900"
                  }`}
                >
                  {item.score}
                </p>
                <p className="text-[11px] text-gray-400">{item.label}</p>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}