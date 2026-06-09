"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AdminButton,
  AdminField,
  AdminInput,
  AdminModal,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/ui";
import {
  AGE_GROUP_OPTIONS,
  AUDIENCE_OPTIONS,
  CAMPAIGN_TYPES,
  CHANNEL_OPTIONS,
  GENDER_OPTIONS,
  MESSAGE_TEMPLATES,
  PLAN_OPTIONS,
  USER_TYPE_OPTIONS,
} from "@/lib/communications/constants";
import { useCommunicationActions } from "@/hooks/TanstankQuery/useCommunications";

const DEFAULT_FILTERS = {
  audiencePreset: "all_users",
  userType: "all",
  plan: "all",
  industry: "all",
  category: "all",
  service: "all",
  company: "all",
  state: "all",
  city: "all",
  gender: "all",
  ageGroup: "all",
};

export default function CreateCampaignModal({
  open,
  onClose,
  preset = {},
  filterOptions = {},
}) {
  const { createCampaign, previewAudience, isProcessing } = useCommunicationActions();
  const [previewCount, setPreviewCount] = useState(null);
  const [form, setForm] = useState({
    name: "",
    campaignType: "platform_announcement",
    channel: "whatsapp",
    messageBody: "",
    templateId: "platform_announcement",
    scheduledAt: "",
    audienceFilters: { ...DEFAULT_FILTERS },
  });

  useEffect(() => {
    if (!open) return;
    const campaignType = preset.campaignType || "platform_announcement";
    const channel = preset.channel || CAMPAIGN_TYPES[campaignType]?.defaultChannel || "whatsapp";
    const template = MESSAGE_TEMPLATES[preset.templateId || campaignType] || MESSAGE_TEMPLATES.custom;
    setForm({
      name: preset.name || "",
      campaignType,
      channel,
      messageBody: preset.messageBody || template?.body || "",
      templateId: preset.templateId || template?.id || "custom",
      scheduledAt: "",
      audienceFilters: { ...DEFAULT_FILTERS, ...(preset.audienceFilters || {}) },
    });
  }, [open, preset]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => {
      previewAudience
        .mutateAsync({
          ...form.audienceFilters,
          audience: form.audienceFilters.audiencePreset,
          channel: form.channel,
          campaignType: form.campaignType,
        })
        .then((result) => setPreviewCount(result.data?.count ?? 0))
        .catch(() => setPreviewCount(null));
    }, 350);
    return () => clearTimeout(timer);
  }, [open, form.audienceFilters, form.channel, form.campaignType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createCampaign.mutateAsync({
        name: form.name,
        campaignType: form.campaignType,
        channel: form.channel,
        messageBody: form.messageBody,
        templateId: form.templateId,
        scheduledAt: form.scheduledAt || null,
        audienceFilters: form.audienceFilters,
      });
      toast.success(form.scheduledAt ? "Campaign scheduled" : "Campaign saved as draft");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to create campaign");
    }
  };

  const setFilter = (key, value) => {
    setForm((current) => ({
      ...current,
      audienceFilters: { ...current.audienceFilters, [key]: value },
    }));
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      eyebrow="Create campaign"
      title="New communication"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <AdminButton variant="secondary" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" form="create-campaign-form" disabled={isProcessing}>
            {isProcessing ? "Saving…" : "Save campaign"}
          </AdminButton>
        </div>
      }
    >
        <form id="create-campaign-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Campaign name">
              <AdminInput
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </AdminField>
            <AdminField label="Campaign type">
              <AdminSelect
                value={form.campaignType}
                onChange={(e) => {
                  const campaignType = e.target.value;
                  const template = MESSAGE_TEMPLATES[campaignType] || MESSAGE_TEMPLATES.custom;
                  setForm((p) => ({
                    ...p,
                    campaignType,
                    channel: CAMPAIGN_TYPES[campaignType]?.defaultChannel || p.channel,
                    templateId: template.id,
                    messageBody: template.body || p.messageBody,
                  }));
                }}
              >
                {Object.values(CAMPAIGN_TYPES).map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Channel">
              <AdminSelect
                value={form.channel}
                onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))}
              >
                {CHANNEL_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Template">
              <AdminSelect
                value={form.templateId}
                onChange={(e) => {
                  const template = MESSAGE_TEMPLATES[e.target.value];
                  setForm((p) => ({
                    ...p,
                    templateId: e.target.value,
                    messageBody: template?.body || p.messageBody,
                  }));
                }}
              >
                {Object.values(MESSAGE_TEMPLATES).map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.label}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
          </div>

          <div className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] p-4">
            <p className="mb-3 text-sm font-semibold text-[#0A4A4A]">Audience filters</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <select value={form.audienceFilters.audiencePreset} onChange={(e) => setFilter("audiencePreset", e.target.value)} className="rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm">
                {AUDIENCE_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <select value={form.audienceFilters.userType} onChange={(e) => setFilter("userType", e.target.value)} className="rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm">
                {USER_TYPE_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <select value={form.audienceFilters.plan} onChange={(e) => setFilter("plan", e.target.value)} className="rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm">
                {PLAN_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <select value={form.audienceFilters.gender} onChange={(e) => setFilter("gender", e.target.value)} className="rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm">
                {GENDER_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <select value={form.audienceFilters.ageGroup} onChange={(e) => setFilter("ageGroup", e.target.value)} className="rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm">
                {AGE_GROUP_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <select value={form.audienceFilters.state} onChange={(e) => setFilter("state", e.target.value)} className="rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm">
                <option value="all">All states</option>
                {(filterOptions.states || []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={form.audienceFilters.city} onChange={(e) => setFilter("city", e.target.value)} className="rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm">
                <option value="all">All cities</option>
                {(filterOptions.cities || []).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.audienceFilters.industry} onChange={(e) => setFilter("industry", e.target.value)} className="rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm">
                <option value="all">All industries</option>
                {(filterOptions.industries || []).map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <p className="mt-3 text-xs text-[#7A928D]">
              Audience preview: <strong>{previewCount ?? "—"}</strong> recipients (resolved server-side)
            </p>
          </div>

          <AdminField label="Message">
            <AdminTextarea
              value={form.messageBody}
              onChange={(e) => setForm((p) => ({ ...p, messageBody: e.target.value }))}
              rows={5}
              maxLength={900}
              required
            />
          </AdminField>

          <AdminField label="Schedule (optional)">
            <AdminInput
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm((p) => ({ ...p, scheduledAt: e.target.value }))}
            />
          </AdminField>
        </form>
    </AdminModal>
  );
}
