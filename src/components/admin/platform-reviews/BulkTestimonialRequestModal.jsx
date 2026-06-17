"use client";



import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import { FiShield, FiUsers } from "react-icons/fi";

import AdminModal from "@/components/admin/ui/AdminModal";
import { AdminConfirmDialog, useConfirmDialog } from "@/components/admin/ui";

import {

  DEFAULT_TESTIMONIAL_AUDIENCE,

  useBulkTestimonialRequest,

  useTestimonialAudiencePreview,

} from "@/hooks/TanstankQuery/useTestimonialAudience";



const SELECT_CLASS =

  "w-full rounded-xl border border-[#D7E5E1] bg-white px-3 py-2.5 text-[12px] font-medium text-[#183534] outline-none transition focus:border-[#0A4A4A] focus:ring-2 focus:ring-[#0A4A4A]/10";



function formatDate(value) {

  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {

    day: "2-digit",

    month: "short",

    year: "numeric",

  });

}



export default function BulkTestimonialRequestModal({

  onClose,

  filters,

  onFiltersChange,

}) {

  const [message, setMessage] = useState("");

  const [useCustomDates, setUseCustomDates] = useState(false);



  const audienceFilters = useMemo(

    () => ({ ...DEFAULT_TESTIMONIAL_AUDIENCE, ...filters }),

    [filters],

  );



  const { data, isLoading, isFetching, error } = useTestimonialAudiencePreview(audienceFilters);

  const bulkMutation = useBulkTestimonialRequest();
  const { confirm, dialogProps } = useConfirmDialog();



  const options = data?.options || { cities: [], services: [], companies: [] };

  const sample = data?.sample || [];

  const count = data?.count || 0;



  useEffect(() => {

    setUseCustomDates(audienceFilters.registeredWithin === "custom");

  }, [audienceFilters.registeredWithin]);



  const patchFilters = (patch) => {

    onFiltersChange({ ...audienceFilters, ...patch });

  };



  const handleSubmit = async () => {

    if (!count) {

      toast.error("No recipients match these filters.");

      return;

    }



    const { confirmed } = await confirm({

      title: "Send testimonial requests",

      message: `Send testimonial requests to ${count} user${count === 1 ? "" : "s"}? Mobile numbers are resolved securely on the server.`,

      confirmLabel: "Send now",

      variant: "primary",

    });



    if (!confirmed) return;



    try {

      const result = await bulkMutation.mutateAsync({

        filters: audienceFilters,

        message,

      });

      toast.success(result.message || `Sent ${result.sent} requests`);

      onClose();

    } catch (actionError) {

      toast.error(actionError.message || "Bulk send failed");

    }

  };



  return (

    <>

    <AdminModal

      open

      onClose={onClose}

      eyebrow="Segment-based outreach"

      title="Send bulk testimonial request"

      size="md"

      footer={

        <button

          type="button"

          onClick={handleSubmit}

          disabled={bulkMutation.isPending || !count}

          className="w-full rounded-xl bg-[#0A4A4A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"

        >

          {bulkMutation.isPending

            ? "Sending requests…"

            : `Send to ${count} user${count === 1 ? "" : "s"}`}

        </button>

      }

    >

      <p className="mb-5 text-sm text-[#5C7571]">

        Pick an audience segment — mobiles stay encrypted and are only resolved server-side.

      </p>



      <div className="space-y-5">

        <div className="rounded-2xl border border-[#D7E5E1] bg-[#FAFCFB] p-4">

          <div className="mb-3 flex items-center gap-2 text-[#0A4A4A]">

            <FiShield size={16} />

            <p className="text-sm font-semibold">PII-safe bulk send</p>

          </div>

          <p className="text-sm leading-6 text-[#5C7571]">

            You choose city, service, company, user type, plan, and registration window. The server

            matches users and sends WhatsApp links — you never type or export mobile numbers.

          </p>

        </div>



        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

          <Field label="User type">

            <select

              value={audienceFilters.userType}

              onChange={(e) => patchFilters({ userType: e.target.value })}

              className={SELECT_CLASS}

            >

              <option value="all">All users</option>

              <option value="customer">Customers only</option>

              <option value="professional">Professionals only</option>

            </select>

          </Field>



          <Field label="City">

            <select

              value={audienceFilters.city}

              onChange={(e) => patchFilters({ city: e.target.value })}

              className={SELECT_CLASS}

            >

              <option value="all">All cities</option>

              {options.cities.map((city) => (

                <option key={city} value={city}>

                  {city}

                </option>

              ))}

            </select>

          </Field>



          <Field label="Service">

            <select

              value={audienceFilters.service}

              onChange={(e) => patchFilters({ service: e.target.value })}

              className={SELECT_CLASS}

            >

              <option value="all">All services</option>

              {options.services.map((service) => (

                <option key={service} value={service}>

                  {service}

                </option>

              ))}

            </select>

          </Field>



          <Field label="Company">

            <select

              value={audienceFilters.company}

              onChange={(e) => patchFilters({ company: e.target.value })}

              className={SELECT_CLASS}

            >

              <option value="all">All companies</option>

              {options.companies.map((company) => (

                <option key={company} value={company}>

                  {company}

                </option>

              ))}

            </select>

          </Field>



          <Field label="Advisor plan">

            <select

              value={audienceFilters.plan}

              onChange={(e) => patchFilters({ plan: e.target.value })}

              disabled={audienceFilters.userType === "customer"}

              className={SELECT_CLASS}

            >

              <option value="all">All plans</option>

              <option value="free">Free</option>

              <option value="silver">Silver</option>

              <option value="gold">Gold</option>

            </select>

          </Field>



          <Field label="Registration window">

            <select

              value={useCustomDates ? "custom" : audienceFilters.registeredWithin}

              onChange={(e) => {

                const value = e.target.value;

                if (value === "custom") {

                  setUseCustomDates(true);

                  patchFilters({ registeredWithin: "custom" });

                } else {

                  setUseCustomDates(false);

                  patchFilters({

                    registeredWithin: value,

                    registeredFrom: "",

                    registeredTo: "",

                  });

                }

              }}

              className={SELECT_CLASS}

            >

              <option value="7d">Last 7 days (latest)</option>

              <option value="30d">Last 30 days (latest)</option>

              <option value="90d">Last 90 days</option>

              <option value="all">All time</option>

              <option value="custom">Custom date range</option>

            </select>

          </Field>

        </div>



        {useCustomDates && (

          <div className="grid grid-cols-2 gap-3">

            <Field label="Registered from">

              <input

                type="date"

                value={audienceFilters.registeredFrom}

                onChange={(e) =>

                  patchFilters({ registeredFrom: e.target.value, registeredWithin: "custom" })

                }

                className={SELECT_CLASS}

              />

            </Field>

            <Field label="Registered to">

              <input

                type="date"

                value={audienceFilters.registeredTo}

                onChange={(e) =>

                  patchFilters({ registeredTo: e.target.value, registeredWithin: "custom" })

                }

                className={SELECT_CLASS}

              />

            </Field>

          </div>

        )}



        <div className="grid grid-cols-2 gap-3">

          <Field label="Sort by registration">

            <select

              value={audienceFilters.sort}

              onChange={(e) => patchFilters({ sort: e.target.value })}

              className={SELECT_CLASS}

            >

              <option value="latest">Latest first</option>

              <option value="oldest">Oldest first</option>

            </select>

          </Field>



          <Field label="Max recipients">

            <select

              value={String(audienceFilters.limit)}

              onChange={(e) => patchFilters({ limit: parseInt(e.target.value, 10) })}

              className={SELECT_CLASS}

            >

              <option value="25">25 users</option>

              <option value="50">50 users</option>

              <option value="100">100 users</option>

              <option value="200">200 users</option>

            </select>

          </Field>

        </div>



        <label className="flex items-center gap-2 text-sm text-[#35504C]">

          <input

            type="checkbox"

            checked={audienceFilters.excludeWithPlatformTestimonial}

            onChange={(e) =>

              patchFilters({ excludeWithPlatformTestimonial: e.target.checked })

            }

            className="rounded border-[#D7E5E1]"

          />

          Skip users who already submitted a platform testimonial

        </label>



        <textarea

          value={message}

          onChange={(e) => setMessage(e.target.value)}

          rows={3}

          placeholder="Optional personal message for all recipients"

          className="w-full rounded-2xl border border-[#E6ECEA] px-4 py-3 text-sm text-[#183534] outline-none focus:border-[#0A4A4A]"

        />



        <section className="rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] p-4">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2 text-[#0A4A4A]">

              <FiUsers size={16} />

              <p className="text-sm font-semibold">Audience preview</p>

            </div>

            {(isLoading || isFetching) && (

              <span className="text-xs text-[#7A928D]">Updating…</span>

            )}

          </div>



          {error ? (

            <p className="mt-3 text-sm text-[#DC2626]">{error.message}</p>

          ) : (

            <>

              <p className="mt-3 text-2xl font-bold text-[#0A4A4A]">

                {count.toLocaleString("en-IN")}

                <span className="ml-2 text-sm font-medium text-[#7A928D]">

                  matching recipient{count === 1 ? "" : "s"}

                </span>

              </p>



              {sample.length > 0 ? (

                <div className="mt-4 space-y-2">

                  {sample.map((row) => (

                    <div

                      key={row.id}

                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#EDF1F0] bg-white px-3 py-2 text-[12px]"

                    >

                      <div>

                        <p className="font-semibold text-[#183534]">{row.name}</p>

                        <p className="text-[#7A928D]">

                          {row.userTypeLabel} · {row.city || "—"} · {formatDate(row.registeredAt)}

                        </p>

                      </div>

                      <span className="font-mono text-[#64748B]">{row.phoneMasked}</span>

                    </div>

                  ))}

                  {count > sample.length && (

                    <p className="text-[11px] text-[#7A928D]">

                      + {count - sample.length} more resolved server-side

                    </p>

                  )}

                </div>

              ) : (

                <p className="mt-3 text-sm text-[#7A928D]">

                  No users match yet. Try broadening city, date, or user-type filters.

                </p>

              )}

            </>

          )}

        </section>

      </div>

    </AdminModal>

    <AdminConfirmDialog {...dialogProps} />

    </>

  );

}



function Field({ label, children }) {

  return (

    <label className="block space-y-1.5">

      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">

        {label}

      </span>

      {children}

    </label>

  );

}


