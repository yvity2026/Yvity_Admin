"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { FaMessage, FaShield } from "react-icons/fa6";
import { IoIosStar } from "react-icons/io";
import { MdClose } from "react-icons/md";

import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import Testimonial_Stats from "@/components/features/advisor/Testimonials/Testimonial_Stats";
import Testimonials_filters from "@/components/features/advisor/Testimonials/Testimonials_filters";
import { useModal } from "@/context/ModalContext";

const normalizeTestimonialType = (value) => {
  if (!value) return "text";

  const normalized = String(value).trim().toLowerCase();

  if (normalized === "text" || normalized === "audio" || normalized === "video") {
    return normalized;
  }

  return "text";
};

const getAverageRating = (items) => {
  const ratings = items
    .map((item) => Number(item?.testimonial_rating ?? 0))
    .filter((rating) => Number.isFinite(rating) && rating > 0);

  if (!ratings.length) return 0;

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Number((total / ratings.length).toFixed(1));
};

const buildStats = (items) => [
  {
    count: items.length,
    label: "total",
    icon: "",
    style: "text-[#111827]",
  },
  {
    count: items.filter((item) => item.status === "pending").length,
    label: "Pending",
    icon: "",
    style: "text-[#F59E0B]",
  },
  {
    count: items.filter((item) => item.status === "approved").length,
    label: "Approval",
    icon: "",
    style: "text-[#0A4A4A]",
  },
  {
    count: getAverageRating(items),
    label: "Avg Rating",
    icon: <IoIosStar />,
    style: "text-[#111827]",
    iconStyle: "text-[#FDD835]",
  },
];

const Page = () => {
  const { trigger, clearTrigger } = useModal();

  const [isRequest, setIsRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [requestForm, setRequestForm] = useState({
    name: "",
    mobile: "",
    type: "",
    message: "",
  });

  const stats = useMemo(() => buildStats(allTestimonials), [allTestimonials]);

  useEffect(() => {
    if (trigger === "REQUEST_TESTIMONIAL") {
      setIsRequest(true);
      clearTrigger();
    }
  }, [clearTrigger, trigger]);

  useEffect(() => {
    const fetchAllTestimonials = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/advisor/testimonials", {
          cache: "no-store",
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to fetch testimonials");
        }

        const items = Array.isArray(json.data)
          ? json.data.map((item) => ({
              ...item,
              testimonial_type: normalizeTestimonialType(item?.testimonial_type || item?.type),
            }))
          : [];

        setAllTestimonials(items);
        setTestimonials(items);
      } catch (err) {
        toast.error(err.message || "Failed to fetch testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTestimonials();
  }, []);

  useEffect(() => {
    if (activeFilter === "All") {
      setTestimonials(allTestimonials);
      return;
    }

    const fetchFilteredTestimonials = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          type: activeFilter,
        });

        const res = await fetch(`/api/advisor/testimonials?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to fetch testimonials");
        }

        const items = Array.isArray(json.data)
          ? json.data.map((item) => ({
              ...item,
              testimonial_type: normalizeTestimonialType(item?.testimonial_type || item?.type),
            }))
          : [];

        setTestimonials(items);
      } catch (err) {
        toast.error(err.message || "Failed to fetch testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredTestimonials();
  }, [activeFilter, allTestimonials]);

  const handleRequestChange = (field, value) => {
    setRequestForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateRequestForm = () => {
    const { name, mobile, type } = requestForm;

    if (!name.trim()) {
      toast.error("Client name is required");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Enter valid 10-digit mobile number");
      return false;
    }

    if (!type) {
      toast.error("Please select testimonial type");
      return false;
    }

    return true;
  };

  const handleRequestSubmit = async () => {
    if (!validateRequestForm()) return;

    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Request sent successfully");
      setIsRequest(false);
      setRequestForm({
        name: "",
        mobile: "",
        type: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handleTestimonialUpdate = (updatedTestimonial) => {
    const nextItem = {
      ...updatedTestimonial,
      testimonial_type: normalizeTestimonialType(
        updatedTestimonial?.testimonial_type || updatedTestimonial?.type
      ),
    };

    setAllTestimonials((prev) =>
      prev.map((item) => (item.id === nextItem.id ? { ...item, ...nextItem } : item))
    );
    setTestimonials((prev) =>
      prev.map((item) =>
        item.id === nextItem.id ? { ...item, ...nextItem } : item
      )
    );
  };

  return (
    <div>
      <div className="px-4 md:p-6 lg:p-10 xl:px-16 xl:pt-6 mx-auto w-full flex flex-col gap-6">
        <Testimonial_Stats stats={stats} loading={loading} />
        <Testimonials_filters
          loading={loading}
          allTestimonials={allTestimonials}
          testimonials={testimonials}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onTestimonialUpdate={handleTestimonialUpdate}
        />
      </div>

      {isRequest && (
        <ModalWrapper onClose={() => setIsRequest(false)}>
          <div className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl no-scrollbar">
            <div className="h-[62px] flex justify-between items-center border-b px-5 md:px-6">
              <span className="flex items-center gap-2 font-semibold">
                <FaMessage />
                Request Testimonials
              </span>

              <MdClose
                className="cursor-pointer"
                onClick={() => setIsRequest(false)}
              />
            </div>

            <div className="px-5 md:px-6 pb-6 mt-5 flex flex-col gap-4">
              <p className="rounded-lg border border-[#DBE1E0] bg-[#E0F4F3] px-4 py-4 text-[#0A4A4A] text-xs leading-5">
                Send a personalized request to your clients asking for a
                testimonial. They verify via OTP.
              </p>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Client Name <span className="text-red-600">*</span>
                </label>
                <input
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="Client Full Name"
                  value={requestForm.name}
                  onChange={(e) => handleRequestChange("name", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Client Mobile <span className="text-red-600">*</span>
                </label>
                <input
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="10-digit mobile number"
                  value={requestForm.mobile}
                  onChange={(e) =>
                    handleRequestChange("mobile", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Testimonial Type <span className="text-red-600">*</span>
                </label>

                <select
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB] text-sm"
                  value={requestForm.type}
                  onChange={(e) => handleRequestChange("type", e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="text">Text</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Personal Message (Optional)
                </label>

                <textarea
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="e.g. Hi Ravi, I hope your plan is helping..."
                  value={requestForm.message}
                  onChange={(e) =>
                    handleRequestChange("message", e.target.value)
                  }
                />
              </div>

              <button className="flex items-center gap-2 text-[#0D6060] text-sm font-semibold">
                <FaPlus />
                Add Point
              </button>

              <button
                onClick={handleRequestSubmit}
                disabled={loading}
                className="mt-4 px-5 py-3 rounded-lg bg-[#0A4A4A] text-white"
              >
                {loading ? "Sending..." : "Request Testimonial"}
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default Page;
