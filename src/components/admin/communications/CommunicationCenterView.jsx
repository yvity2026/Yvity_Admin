"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiRefreshCw, FiSend, FiUsers } from "react-icons/fi";
import { MdOutlineCampaign } from "react-icons/md";
import { useAdmin } from "@/context/AuthAdminContext";
import { hasPermission } from "@/lib/admin/permissions";
import { AdminConfirmDialog, useConfirmDialog } from "@/components/admin/ui";
import {
  AUDIENCE_OPTIONS,
  CHANNEL_OPTIONS,
  COMMUNICATION_TYPES,
  STATUS_LABELS,
  STATUS_TONES,
} from "@/lib/communications/constants";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function CommunicationCenterView() {
  const { admin } = useAdmin();
  const canCompose = hasPermission(admin, "campaigns");
  const canSend = hasPermission(admin, "send_campaigns");

  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const { confirm, dialogProps } = useConfirmDialog();
  const [previewCount, setPreviewCount] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    messageBody: "",
    audience: "all_users",
    communicationType: "platform",
    channel: "whatsapp",
  });

  const loadCommunications = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/communications");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load communications");
      }

      setCommunications(json.data || []);
    } catch (error) {
      toast.error(error.message);
      setCommunications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommunications();
  }, [loadCommunications]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setPreviewLoading(true);

      try {
        const res = await fetch("/api/admin/communications/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audience: form.audience,
            communicationType: form.communicationType,
            channel: form.channel,
          }),
        });

        const json = await res.json();

        if (res.ok) {
          setPreviewCount(json.data?.count ?? 0);
        }
      } catch {
        setPreviewCount(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [form.audience, form.communicationType, form.channel]);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!canCompose) {
      toast.error("You do not have permission to compose communications.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to save communication");
      }

      toast.success("Communication saved as draft");
      setForm({
        name: "",
        messageBody: "",
        audience: "all_users",
        communicationType: "platform",
        channel: "whatsapp",
      });
      await loadCommunications();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (communication) => {
    if (!canSend) {
      toast.error("You do not have permission to send communications.");
      return;
    }

    const ok = await confirm({
      title: "Send communication",
      message: `Send "${communication.name}" to ${communication.recipientCount} recipients via WhatsApp?`,
      confirmLabel: "Send now",
      variant: "primary",
    });

    if (!ok) return;

    setSendingId(communication.id);

    try {
      const res = await fetch(`/api/admin/communications/${communication.id}/send`, {
        method: "POST",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Send failed");
      }

      toast.success(json.message || "Communication sent");
      await loadCommunications();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="min-h-full p-3 sm:p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="admin-glass-card rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#E8F4F3] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0A4A4A]">
                <MdOutlineCampaign className="text-[#F59E0B]" />
                Administration
              </div>
              <h1 className="font-cormorant text-3xl font-bold text-[#0A4A4A]">
                Communication Center
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#53807E]">
                Send platform announcements or marketing offers from YVITY. Recipients are
                resolved server-side — phone numbers are never exported in bulk to the admin UI.
              </p>
            </div>

            <div className="admin-glass-card flex items-center gap-3 rounded-2xl px-4 py-3">
              <FiUsers className="text-[#F59E0B]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7A928D]">
                  Audience preview
                </p>
                <p className="admin-num text-xl font-bold text-[#0A4A4A]">
                  {previewLoading ? "…" : previewCount ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <form
            onSubmit={handleCreate}
            className="admin-glass-card space-y-5 rounded-2xl p-6 xl:col-span-5"
          >
            <h2 className="font-poppins text-lg font-bold text-[#0A4A4A]">Compose</h2>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
                Title
              </span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, name: event.target.value }))
                }
                placeholder="e.g. March pricing update"
                className="w-full rounded-xl border border-[#E4E2DB] bg-white/80 px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
                disabled={!canCompose}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
                Type
              </span>
              <select
                value={form.communicationType}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    communicationType: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#E4E2DB] bg-white/80 px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
                disabled={!canCompose}
              >
                {Object.values(COMMUNICATION_TYPES).map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#7A928D]">
                {COMMUNICATION_TYPES[form.communicationType]?.description}
              </p>
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
                  Audience
                </span>
                <select
                  value={form.audience}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, audience: event.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E2DB] bg-white/80 px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
                  disabled={!canCompose}
                >
                  {AUDIENCE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
                  Channel
                </span>
                <select
                  value={form.channel}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, channel: event.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E2DB] bg-white/80 px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
                  disabled={!canCompose}
                >
                  {CHANNEL_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
                Message
              </span>
              <textarea
                value={form.messageBody}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    messageBody: event.target.value,
                  }))
                }
                rows={6}
                maxLength={900}
                placeholder="Write the message users will receive on WhatsApp…"
                className="w-full resize-y rounded-xl border border-[#E4E2DB] bg-white/80 px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
                disabled={!canCompose}
              />
              <p className="text-right text-[11px] text-[#7A928D]">
                {form.messageBody.length}/900
              </p>
            </label>

            <button
              type="submit"
              disabled={!canCompose || saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A4A4A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0D6060] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>

            {!canCompose && (
              <p className="text-xs text-[#B45309]">
                Your role can view history but not compose. Ask a super admin for the
                &quot;Marketing campaigns&quot; permission.
              </p>
            )}
          </form>

          <div className="admin-glass-card rounded-2xl p-6 xl:col-span-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-poppins text-lg font-bold text-[#0A4A4A]">History</h2>
              <button
                type="button"
                onClick={loadCommunications}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E4E2DB] bg-white/70 px-3 py-2 text-xs font-semibold text-[#0A4A4A] hover:bg-white"
              >
                <FiRefreshCw />
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-[#53807E]">Loading communications…</p>
            ) : communications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#E4E2DB] bg-white/50 px-4 py-10 text-center">
                <p className="text-sm text-[#53807E]">No communications yet.</p>
                <p className="mt-1 text-xs text-[#7A928D]">
                  Compose a message and save a draft to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {communications.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-[#E4E2DB]/80 bg-white/65 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-poppins text-sm font-bold text-[#0A4A4A]">
                            {item.name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_TONES[item.status] || STATUS_TONES.draft}`}
                          >
                            {STATUS_LABELS[item.status] || item.status}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs text-[#5C7571]">
                          {item.messageBody}
                        </p>
                        <div className="admin-num mt-3 flex flex-wrap gap-3 text-[11px] text-[#7A928D]">
                          <span>
                            {AUDIENCE_OPTIONS.find((option) => option.id === item.audience)
                              ?.label || item.audience}
                          </span>
                          <span>·</span>
                          <span>
                            {item.recipientCount} recipients
                          </span>
                          {item.status === "sent" ? (
                            <>
                              <span>·</span>
                              <span>
                                {item.sentCount} sent / {item.failedCount} failed
                              </span>
                            </>
                          ) : null}
                          <span>·</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>

                      {item.status === "draft" && canSend ? (
                        <button
                          type="button"
                          onClick={() => handleSend(item)}
                          disabled={sendingId === item.id}
                          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-2 text-xs font-bold text-white hover:bg-[#D97706] disabled:opacity-60"
                        >
                          <FiSend />
                          {sendingId === item.id ? "Sending…" : "Send now"}
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <AdminConfirmDialog {...dialogProps} />
    </div>
  );
}
