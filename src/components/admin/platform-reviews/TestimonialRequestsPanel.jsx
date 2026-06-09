"use client";

import { FiUsers } from "react-icons/fi";
import { useTestimonialAudiencePreview } from "@/hooks/TanstankQuery/useTestimonialAudience";

const SELECT_CLASS =
  "rounded-xl border border-[#D7E5E1] bg-white px-3 py-2.5 text-[12px] font-medium text-[#183534] outline-none transition focus:border-[#0A4A4A] focus:ring-2 focus:ring-[#0A4A4A]/10";

export default function TestimonialRequestsPanel({
  filters,
  onFiltersChange,
  onSendIndividual,
  onSendBulk,
}) {
  const { data } = useTestimonialAudiencePreview(filters);
  const options = data?.options || { cities: [], services: [], companies: [] };
  const count = data?.count || 0;

  const patch = (key, value) => onFiltersChange({ ...filters, [key]: value });

  return (
    <section className="rounded-[24px] border border-[#E6ECEA] bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            Testimonial requests
          </p>
          <h2 className="mt-2 font-cormorant text-2xl font-bold text-[#0A4A4A]">
            Collect more platform reviews
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[#5C7571]">
            Segment by city, service, company, customers or professionals, registration date, and
            advisor plan. Bulk send never exposes encrypted mobiles in the admin UI.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSendIndividual}
            className="rounded-full bg-[#0A4A4A] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#0D6060]"
          >
            Send individual request
          </button>
          <button
            type="button"
            onClick={onSendBulk}
            className="rounded-full border border-[#0A4A4A]/20 bg-[#F4F8F7] px-4 py-2 text-[12px] font-semibold text-[#0A4A4A] transition hover:bg-[#E8F5F0]"
          >
            Send bulk request
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
          Audience filters
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <select
            value={filters.userType}
            onChange={(e) => patch("userType", e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="all">All users</option>
            <option value="customer">Customers</option>
            <option value="professional">Professionals</option>
          </select>

          <select
            value={filters.city}
            onChange={(e) => patch("city", e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="all">All cities</option>
            {options.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={filters.service}
            onChange={(e) => patch("service", e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="all">All services</option>
            {options.services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>

          <select
            value={filters.company}
            onChange={(e) => patch("company", e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="all">All companies</option>
            {options.companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            value={filters.plan}
            onChange={(e) => patch("plan", e.target.value)}
            disabled={filters.userType === "customer"}
            className={SELECT_CLASS}
          >
            <option value="all">All plans</option>
            <option value="free">Free</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
          </select>

          <select
            value={filters.registeredWithin}
            onChange={(e) => patch("registeredWithin", e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#E8F5F0] bg-[#F8FBFA] px-4 py-3">
          <FiUsers className="text-[#0A4A4A]" size={16} />
          <p className="text-sm text-[#35504C]">
            <span className="font-semibold text-[#0A4A4A]">
              {count.toLocaleString("en-IN")} users
            </span>{" "}
            match this segment (latest registrations first, mobiles resolved only when sending).
          </p>
        </div>
      </div>
    </section>
  );
}
