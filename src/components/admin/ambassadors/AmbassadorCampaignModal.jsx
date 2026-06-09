"use client";



import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import AdminModal from "@/components/admin/ui/AdminModal";
import { AdminConfirmDialog, useConfirmDialog } from "@/components/admin/ui";

import { useAmbassadorActions } from "@/hooks/TanstankQuery/useAmbassadors";



async function fetchAudiencePreview(audience) {

  const res = await fetch("/api/admin/ambassadors", {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ action: "preview_campaign_audience", audience }),

  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(json.error || "Preview failed");

  return json;

}



const DEFAULT_FORM = {

  name: "",

  messageBody: "",

  audience: "active_ambassadors",

};



export default function AmbassadorCampaignModal({

  open,

  onClose,

  audiences = [],

  campaigns = [],

  initialName = "",

  initialMessage = "",

}) {

  const { createCampaign, sendCampaign, isProcessing } = useAmbassadorActions();

  const [form, setForm] = useState(DEFAULT_FORM);

  const [previewCount, setPreviewCount] = useState(null);

  const [previewLoading, setPreviewLoading] = useState(false);



  useEffect(() => {

    if (!open) return;

    setForm({

      ...DEFAULT_FORM,

      name: initialName,

      messageBody: initialMessage,

    });

  }, [open, initialName, initialMessage]);



  useEffect(() => {

    if (!open) return undefined;



    const timer = setTimeout(() => {

      setPreviewLoading(true);

      fetchAudiencePreview(form.audience)

        .then((result) => setPreviewCount(result.count ?? 0))

        .catch(() => setPreviewCount(null))

        .finally(() => setPreviewLoading(false));

    }, 300);



    return () => clearTimeout(timer);

  }, [open, form.audience]);



  const handleCreate = async (sendNow = false) => {

    try {

      const result = await createCampaign(form);

      toast.success(sendNow ? "Campaign created" : "Campaign saved as draft");



      if (sendNow) {

        const ok = await confirm({

          title: "Send campaign",

          message: `Send "${result.campaign.name}" to ${result.campaign.recipientCount} ambassadors now?`,

          confirmLabel: "Send now",

          variant: "primary",

        });

        if (!ok) {

          onClose();

          return;

        }



        const sendResult = await sendCampaign(result.campaign.id);

        toast.success(

          sendResult.simulated

            ? `Campaign simulated (${sendResult.sentCount} sent)`

            : `Campaign sent (${sendResult.sentCount} sent)`,

        );

      }



      onClose();

    } catch (error) {

      toast.error(error.message || "Could not create campaign");

    }

  };



  const handleSendDraft = async (campaign) => {

    const ok = await confirm({

      title: "Send campaign",

      message: `Send "${campaign.name}" to ${campaign.recipientCount} ambassadors now?`,

      confirmLabel: "Send now",

      variant: "primary",

    });

    if (!ok) return;



    try {

      const result = await sendCampaign(campaign.id);

      toast.success(

        result.simulated

          ? `Campaign simulated (${result.sentCount} sent)`

          : `Campaign sent (${result.sentCount} sent)`,

      );

      onClose();

    } catch (error) {

      toast.error(error.message || "Could not send campaign");

    }

  };



  return (

    <>

    <AdminModal

      open={open}

      onClose={onClose}

      eyebrow="Ambassador program"

      title="Create ambassador campaign"

      size="md"

      footer={

        <div className="flex flex-wrap gap-2">

          <button

            type="submit"

            form="ambassador-campaign-form"

            disabled={isProcessing}

            className="inline-flex items-center justify-center rounded-full bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0D6060] disabled:opacity-60"

          >

            {isProcessing ? "Saving…" : "Save draft"}

          </button>

          <button

            type="button"

            disabled={isProcessing}

            onClick={() => void handleCreate(true)}

            className="inline-flex items-center justify-center rounded-full bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#D97706] disabled:opacity-60"

          >

            {isProcessing ? "Working…" : "Create & send now"}

          </button>

        </div>

      }

    >

      <p className="mb-5 text-sm text-[#5C7571]">

        Compose a WhatsApp message for ambassadors. Works in local dev (simulated send) and

        production.

      </p>



      <div className="rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] px-4 py-3">

        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">

          Audience preview

        </p>

        <p className="admin-num mt-1 text-2xl font-bold text-[#0A4A4A]">

          {previewLoading ? "…" : previewCount ?? "—"}

        </p>

        <p className="text-[12px] text-[#7A928D]">reachable ambassadors with phone numbers</p>

      </div>



      <form

        id="ambassador-campaign-form"

        className="mt-5 space-y-4"

        onSubmit={(event) => {

          event.preventDefault();

          void handleCreate(false);

        }}

      >

        <label className="block space-y-1.5">

          <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">

            Campaign title

          </span>

          <input

            value={form.name}

            onChange={(event) =>

              setForm((previous) => ({ ...previous, name: event.target.value }))

            }

            placeholder="e.g. March referral push"

            className="w-full rounded-xl border border-[#E4E2DB] bg-white px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"

            required

          />

        </label>



        <label className="block space-y-1.5">

          <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">

            Audience

          </span>

          <select

            value={form.audience}

            onChange={(event) =>

              setForm((previous) => ({ ...previous, audience: event.target.value }))

            }

            className="w-full rounded-xl border border-[#E4E2DB] bg-white px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"

          >

            {audiences.map((option) => (

              <option key={option.id} value={option.id}>

                {option.label}

              </option>

            ))}

          </select>

        </label>



        <label className="block space-y-1.5">

          <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">

            Message

          </span>

          <textarea

            value={form.messageBody}

            onChange={(event) =>

              setForm((previous) => ({ ...previous, messageBody: event.target.value }))

            }

            rows={6}

            maxLength={900}

            placeholder="Share your referral link and remind ambassadors that rewards unlock when referrals buy Silver or Gold…"

            className="w-full resize-y rounded-xl border border-[#E4E2DB] bg-white px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"

            required

          />

          <p className="text-right text-[11px] text-[#7A928D]">{form.messageBody.length}/900</p>

        </label>

      </form>



      {campaigns.length > 0 ? (

        <div className="mt-6 border-t border-[#EEF2F0] pt-5">

          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">

            Recent campaigns

          </p>

          <div className="mt-3 space-y-2">

            {campaigns.slice(0, 5).map((campaign) => (

              <div

                key={campaign.id}

                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-3 py-3"

              >

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-[#183534]">{campaign.name}</p>

                  <p className="text-[11px] text-[#7A928D]">

                    {campaign.audienceLabel} · {campaign.recipientCount} recipients ·{" "}

                    {campaign.statusLabel}

                  </p>

                </div>

                {campaign.status === "draft" ? (

                  <button

                    type="button"

                    disabled={isProcessing}

                    onClick={() => void handleSendDraft(campaign)}

                    className="shrink-0 rounded-full bg-[#0A4A4A] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0D6060] disabled:opacity-60"

                  >

                    Send

                  </button>

                ) : null}

              </div>

            ))}

          </div>

        </div>

      ) : null}

    </AdminModal>

    <AdminConfirmDialog {...dialogProps} />

    </>

  );

}


