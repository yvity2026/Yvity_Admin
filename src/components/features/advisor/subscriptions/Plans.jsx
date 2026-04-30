"use client";
import { pricingData } from "@/app/advisor/subscriptions/page";
import { useAuth } from "@/context/AuthUserContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { HiMiniShieldCheck } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";

const Plans = ({ setIsUpgrade }) => {
  const { advisor } = useAuth();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const handlePlanPayment = async (plan) => {
    try {
      setLoading(true);

      const res = await fetch("/api/payment/update-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toPlan: plan.title.toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!data.orderId) {
        toast.error(data.error || "Order failed");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount, // already in paise
        currency: "INR",
        order_id: data.orderId,

        handler: async function (response) {
          // ⚠️ IMPORTANT: verify payment
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const result = await verify.json();

          if (result.success) {
            toast.success("Plan upgraded successfully");
            window.location.reload();
          } else {
            toast.error("Payment verification failed");
          }
        },

        theme: {
          color: "#0A4A4A",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto w-full  bg-white px-3  xl:px-[40px] py-[27px] rounded-2xl">
      <p className="text-[var(--headings-important-text)] text-base sm:text-lg md:text-[16px] font-bold leading-normal font-[Poppins] mb-4">
        Plan Comparision
      </p>
      <div className="xl:px-[40px] grid grid-cols-1 lg:grid-cols-3 gap-4 w-full md:justify-items-center">
        {pricingData.map((item, index) => (
          <div
            key={index}
            // variants={itemstyle}
            className={`${item.cardStyle} relative w-full flex flex-col gap-4 mx-auto p-4 md:py-[36px] md:px-[16px] rounded-2xl border border-[#E5E5E5] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]`}
          >
            <span className="flex justify-start">{item.medal}</span>
            <p className="text-xl md:text-2xl font-semibold tracking-[1.4px] text-(--ct-as-badges-accents,#F59E0B) uppercase font-poppins leading-none">
              {item.title}
            </p>
            <p
              className={`text-xl sm:text-2xl lg:text-3xl font-bold font-poppins text-[#111827]`}
            >
              ₹{Number(item.price?.split("/")[0] || 0)}
              <span className="text-gray-400 text-base font-bold">
                {item.period}
              </span>
            </p>
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col justify-start items-start gap-2 md:gap-2 mt-2 md:pt-6 text-[var(--Body-content)] text-xs sm:text-sm md:text-[12px] font-normal leading-normal font-[Poppins]">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <FaCheck className="text-green-400" />
                    {feature}
                  </li>
                ))}

                {item.nonFeatures?.map((nonFeature, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <RxCross2 />
                    {nonFeature}
                  </li>
                ))}
              </ul>
              <button
                disabled={loading}
                className={`w-full mt-4 md:mt-0 flex items-center justify-center gap-2 rounded-full transition-all duration-500 ease-in-out text-[clamp(12px,1.5vw,16px)] ${item.buttonStyle}`}
                onClick={() => {
                  // Free plan → no payment
                  if (
                    item?.title?.toLocaleLowerCase() ===
                    advisor?.subscription_plan
                  ) {
                    setIsUpgrade(true);
                    return;
                  }

                  setIsUpgrade(false);
                  handlePlanPayment(item);
                }}
              >
                {loading ? "Processing..." : item.buttonText}
              </button>
            </div>
            {item.cover && (
              <span
                className={`${item.coverStyle} flex items-center gap-1 font-poppins font-semibold md:gap-2 md:w-36`}
              >
                <HiMiniShieldCheck size={16} />
                {item.cover}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
