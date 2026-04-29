// components/PricingModal.jsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const PricingModal = ({ isOpen, onClose, userEmail, userName, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Plan data based on your requirements
  const plans = {
    free: {
      id: "free",
      name: "FREE",
      price: 0,
      priceDisplay: "0",
      period: "Forever Free",
      badge: null,
      razorpayPlanId: null,
      features: {
        "Appears in Search": "Yes",
        "Identity Verified badge": "Yes",
        "IRDAI License Verified": "No",
        "Text Reviews": "5 max",
        "Audio Reviews": "No",
        "Video Reviews": "No",
        Recommendations: "No",
        "Intro Video": "No",
        "QR Code Download": "No",
        "Founding Advisor Badge": "No",
        "Priority Directory Listing": "No",
      },
    },
    silver: {
      id: "silver",
      name: "SILVER",
      price: 99900, // in paise (₹999)
      priceDisplay: "999",
      period: "/year",
      badge: null,
      razorpayPlanId: "plan_SILVER_001", // Replace with your actual Razorpay Plan ID
      features: {
        "Appears in Search": "Yes",
        "Identity Verified badge": "Yes",
        "IRDAI License Verified": "Yes",
        "Text Reviews": "Unlimited",
        "Audio Reviews": "Yes",
        "Video Reviews": "No",
        Recommendations: "Yes",
        "Intro Video": "No",
        "QR Code Download": "No",
        "Founding Advisor Badge": "No",
        "Priority Directory Listing": "No",
      },
    },
    gold: {
      id: "gold",
      name: "GOLD",
      price: 299900, // in paise (₹2,999)
      priceDisplay: "2,999",
      period: "/year",
      badge: "Most Popular",
      razorpayPlanId: "plan_GOLD_001", // Replace with your actual Razorpay Plan ID
      features: {
        "Appears in Search": "Yes (Priority)",
        "Identity Verified badge": "Yes",
        "IRDAI License Verified": "Yes",
        "Text Reviews": "Unlimited",
        "Audio Reviews": "Yes",
        "Video Reviews": "Yes",
        Recommendations: "Yes",
        "Intro Video": "Yes",
        "QR Code Download": "Yes",
        "Founding Advisor Badge": "Yes",
        "Priority Directory Listing": "Yes",
      },
    },
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create order on your backend
  const createOrder = async (plan) => {
    const response = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId: plan.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return response.json();
  };

  // Handle free plan
  const handleFreePlan = async () => {
    setIsProcessing(true);
    try {
      // Call your backend to activate free plan
      const response = await fetch("/api/activate-free-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: "free",
          userEmail: userEmail,
          userName: userName,
        }),
      });

      if (response.ok) {
        toast.success("Free plan activated successfully");
        if (onSuccess) onSuccess({ plan: "free", success: true });
        onClose();
      } else {
        throw new Error("Failed to activate free plan");
      }
    } catch (error) {
      console.error("Free plan activation error:", error);
     toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle paid plan with Razorpay
  const handlePaidPlan = async (plan) => {
    setIsProcessing(true);

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error(
          "Failed to load payment gateway. Please check your internet connection.",
        );
        setIsProcessing(false);
        return;
      }

      // Create order on backend
      const orderData = await createOrder(plan);

      // Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Your Company Name",
        description: `${plan.name} Plan Subscription`,
        image: "/logo.png", // Optional: Add your logo URL
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const res = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!res.ok) {
              toast.error("Payment verification failed");
              return;
            }

            // DO NOT mark success here
            toast.loading("Payment received. Activating your plan...");

            if (onSuccess) {
              onSuccess({
                plan: plan.id,
                success: "processing",
              });
            }
            onClose();
          } catch (err) {
            console.error(err);
            toast.error("Verification error");
          }
        },

        prefill: {
          name: userName || "Customer",
          email: userEmail || "customer@example.com",
        },
        notes: {
          plan: plan.id,
          planName: plan.name,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (!selectedPlan) return;

    if (selectedPlan === "free") {
      handleFreePlan();
    } else if (selectedPlan === "silver") {
      handlePaidPlan(plans.silver);
    } else if (selectedPlan === "gold") {
      handlePaidPlan(plans.gold);
    }
  };

  const handlePlanClick = (planKey) => {
    setSelectedPlan(planKey);
    if (expandedPlan === planKey) {
      setExpandedPlan(null);
    } else {
      setExpandedPlan(planKey);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-[#0D4D4D]/40 via-black/60 to-[#F39C12]/30 backdrop-blur-md transition-all"
        onClick={onClose}
      />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      {/* Modal - Max width 600px */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.35)] w-full max-w-[600px] mx-auto transition-all border border-white/20">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center pt-8 pb-4 px-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Select the perfect plan for your needs
            </p>
          </div>

          {/* Plan buttons - vertical layout */}
          <div className="px-4 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* FREE Plan Button */}
            <div className="relative ">
              <button
                onClick={() => handlePlanClick("free")}
                disabled={isProcessing}
                className={`
                  w-full text-left p-4 rounded-xl border-2 transition-all duration-300
                  ${
                    selectedPlan === "free"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }
                  ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      FREE Plan
                    </h3>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹0
                      </span>
                      <span className="text-gray-600 ml-2 text-sm">
                        Forever Free
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedPlan === "free" && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Selected
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 transform transition-transform ${expandedPlan === "free" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Features slide down for FREE */}
              {expandedPlan === "free" && (
                <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slideDown">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    Features included:
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.entries(plans.free.features).map(
                      ([feature, value]) => (
                        <div
                          key={feature}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-gray-700">{feature}</span>
                          <span
                            className={`font-medium ${
                              value === "Yes"
                                ? "text-green-600"
                                : value === "No"
                                  ? "text-red-500"
                                  : "text-gray-800"
                            }`}
                          >
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SILVER Plan Button */}
            <div className="relative">
              <button
                onClick={() => handlePlanClick("silver")}
                disabled={isProcessing}
                className={`
                  w-full text-left p-4 rounded-xl border-2 transition-all duration-300
                  ${
                    selectedPlan === "silver"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }
                  ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      SILVER Plan
                    </h3>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹999
                      </span>
                      <span className="text-gray-600 ml-2 text-sm">/year</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Best value for professionals
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedPlan === "silver" && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Selected
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 transform transition-transform ${expandedPlan === "silver" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Features slide down for SILVER */}
              {expandedPlan === "silver" && (
                <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slideDown">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    Features included:
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.entries(plans.silver.features).map(
                      ([feature, value]) => (
                        <div
                          key={feature}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-gray-700">{feature}</span>
                          <span
                            className={`font-medium ${
                              value === "Yes"
                                ? "text-green-600"
                                : value === "No"
                                  ? "text-red-500"
                                  : "text-gray-800"
                            }`}
                          >
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* GOLD Plan Button */}
            <div className="relative">
              <button
                onClick={() => handlePlanClick("gold")}
                disabled={isProcessing}
                className={`
                  w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative
                  ${
                    selectedPlan === "gold"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }
                  ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-lg">
                    ⭐ MOST POPULAR
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      GOLD Plan
                    </h3>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹2,999
                      </span>
                      <span className="text-gray-600 ml-2 text-sm">/year</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Ultimate experience with all features
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedPlan === "gold" && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Selected
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 transform transition-transform ${expandedPlan === "gold" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Features slide down for GOLD */}
              {expandedPlan === "gold" && (
                <div className="mt-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 animate-slideDown">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    Premium features included:
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.entries(plans.gold.features).map(
                      ([feature, value]) => (
                        <div
                          key={feature}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-gray-700">{feature}</span>
                          <span
                            className={`font-medium ${
                              value.includes("Yes")
                                ? "text-green-600"
                                : value === "No"
                                  ? "text-red-500"
                                  : "text-amber-700 font-semibold"
                            }`}
                          >
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="px-6 pb-6 pt-4 border-t bg-gray-50 rounded-b-2xl">
            <button
              onClick={handleContinue}
              disabled={!selectedPlan || isProcessing}
              className={`
                w-full py-3 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer
                ${
                  selectedPlan && !isProcessing
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                }
              `}
            >
              {isProcessing && (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </div>
              )}
              {!isProcessing && !selectedPlan && "Select a plan to continue"}
              {!isProcessing &&
                selectedPlan === "free" &&
                "✨ Continue with FREE Plan ✨"}
              {!isProcessing &&
                selectedPlan === "silver" &&
                "💳 Continue to Payment (₹999/yr)"}
              {!isProcessing &&
                selectedPlan === "gold" &&
                "💎 Continue to Payment (₹2,999/yr)"}
            </button>

            {selectedPlan && selectedPlan !== "free" && !isProcessing && (
              <p className="text-center text-xs text-gray-500 mt-3">
                🔒 Secure payment via Razorpay • 30-day money-back guarantee
              </p>
            )}
            {selectedPlan === "free" && !isProcessing && (
              <p className="text-center text-xs text-gray-500 mt-3">
                No credit card required • Free forever • Upgrade anytime
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PricingModal;
