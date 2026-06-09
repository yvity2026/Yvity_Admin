"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiCopy, FiEye, FiRefreshCw, FiSend } from "react-icons/fi";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import CreateCampaignModal from "@/components/admin/communications/CreateCampaignModal";
import {
  AdminButton,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminErrorState,
  AdminModal,
  AdminPageHero,
  AdminPageShell,
  AdminPageSkeleton,
  AdminPanel,
  AdminSectionTitle,
  AdminTabBar,
  useConfirmDialog,
} from "@/components/admin/ui";
import { useAdmin } from "@/context/AuthAdminContext";
import { hasPermission } from "@/lib/admin/permissions";
import {
  QUICK_ACTIONS,
  STATUS_LABELS,
  STATUS_TONES,
} from "@/lib/communications/constants";
import {
  useCommunicationActions,
  useCommunicationsOverview,
} from "@/hooks/TanstankQuery/useCommunications";

const TABS = [
  { id: "campaigns", label: "Campaigns" },
  { id: "history", label: "Message history" },
  { id: "testimonials", label: "Testimonial requests" },
  { id: "recommendations", label: "Recommendation requests" },
  { id: "announcements", label: "Announcements" },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function AdminCommunicationCenterView() {
  const { admin } = useAdmin();
  const canCompose = hasPermission(admin, "campaigns");
  const canSend = hasPermission(admin, "send_campaigns");
  const { data, isLoading, isError, error, refetch, isFetching } = useCommunicationsOverview();
  const { sendCampaign, duplicateCampaign, createAnnouncement, isProcessing } =
    useCommunicationActions();
  const { confirm, dialogProps } = useConfirmDialog();

  const [tab, setTab] = useState("campaigns");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState({});
  const [viewCampaign, setViewCampaign] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    messageBody: "",
    pinned: false,
    scheduledAt: "",
  });

  const overview = data?.overview || {};
  const campaigns = data?.campaigns || [];
  const history = data?.history || campaigns.filter((row) => row.status === "sent");
  const announcements = data?.announcements || [];
  const filterOptions = data?.filterOptions || {};

  const metrics = [
    { id: "total", label: "Total messages sent", value: String(overview.totalMessagesSent || 0), emoji: "📨", accent: "teal" },
    { id: "email", label: "Email campaigns", value: String(overview.emailCampaigns || 0), emoji: "✉", accent: "gold" },
    { id: "sms", label: "SMS campaigns", value: String(overview.smsCampaigns || 0), emoji: "📱", accent: "success" },
    { id: "wa", label: "WhatsApp campaigns", value: String(overview.whatsappCampaigns || 0), emoji: "💬", accent: "teal" },
    { id: "active", label: "Active campaigns", value: String(overview.activeCampaigns || 0), emoji: "⚡", accent: "coral" },
  ];

  const openCreate = (preset = {}) => {
    if (!canCompose) {
      toast.error("You do not have permission to compose campaigns.");
      return;
    }
    setModalPreset(preset);
    setModalOpen(true);
  };

  const handleSend = async (campaign) => {
    if (!canSend) {
      toast.error("You do not have permission to send campaigns.");
      return;
    }
    const ok = await confirm({
      title: "Send campaign",
      message: `Send "${campaign.name}" to ${campaign.recipientCount} recipients?`,
      confirmLabel: "Send now",
      variant: "primary",
    });
    if (!ok) return;
    try {
      const result = await sendCampaign.mutateAsync(campaign.id);
      toast.success(result.message || "Campaign sent");
    } catch (err) {
      toast.error(err.message || "Send failed");
    }
  };

  const handleDuplicate = async (campaign) => {
    try {
      await duplicateCampaign.mutateAsync(campaign.id);
      toast.success("Campaign duplicated");
    } catch (err) {
      toast.error(err.message || "Duplicate failed");
    }
  };

  const handleAnnouncement = async (event) => {
    event.preventDefault();
    if (!canCompose) return;
    try {
      await createAnnouncement.mutateAsync(announcementForm);
      toast.success("Announcement created");
      setAnnouncementForm({ title: "", messageBody: "", pinned: false, scheduledAt: "" });
    } catch (err) {
      toast.error(err.message || "Failed to create announcement");
    }
  };

  if (isLoading) {
    return <AdminPageSkeleton layout="default" />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load Communication Center"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const requestPanel = (type, title) => (
    <AdminPanel>
      <h2 className="font-cormorant text-[22px] font-bold text-[#0A4A4A]">{title}</h2>
      <p className="mt-1 text-sm text-[#5C7571]">
        Send individual or bulk requests with industry, service, company, and plan filters.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            openCreate({
              campaignType: type,
              channel: "whatsapp",
              name: type === "testimonial_request" ? "Testimonial request" : "Recommendation request",
            })
          }
          className="rounded-full bg-[#0A4A4A] px-4 py-2 text-xs font-semibold text-white"
        >
          Individual request
        </button>
        <button
          type="button"
          onClick={() =>
            openCreate({
              campaignType: type,
              channel: "whatsapp",
              name: `Bulk ${type === "testimonial_request" ? "testimonial" : "recommendation"} request`,
              audienceFilters: { plan: "all", industry: "all" },
            })
          }
          className="rounded-full border border-[#0A4A4A]/20 px-4 py-2 text-xs font-semibold text-[#0A4A4A]"
        >
          Bulk request
        </button>
      </div>
    </AdminPanel>
  );

  return (
    <AdminPageShell>
        <AdminPageHero
          eyebrow="📢 Communication Center"
          title="Reach your users at scale"
          description="Campaigns, announcements, and request flows. Recipients are resolved server-side — contact data is never bulk-exported."
          refreshing={isFetching}
        />

        <AdminPanel>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {metrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="mb-3 flex items-center justify-between gap-3">
            <AdminSectionTitle title="Quick actions" className="mb-0" titleClassName="text-[20px]" />
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-[#E6ECEA] px-3 py-1.5 text-xs font-semibold text-[#0A4A4A]"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() =>
                  openCreate({
                    campaignType: action.campaignType,
                    channel: action.channel,
                    name: action.label,
                  })
                }
                className="rounded-full bg-[#E8F4F3] px-4 py-2 text-[12px] font-semibold text-[#0A4A4A] hover:bg-[#D7EEEC]"
              >
                {action.label}
              </button>
            ))}
            <AdminButton size="sm" onClick={() => openCreate()}>
              + Create campaign
            </AdminButton>
          </div>
        </AdminPanel>

        <AdminTabBar
          items={TABS}
          value={tab}
          onChange={setTab}
          ariaLabel="Communication Center sections"
          scrollable
        />

        {tab === "campaigns" && (
          <AdminPanel>
            <AdminSectionTitle title="Campaigns" />
            <div className="overflow-x-auto rounded-[16px] border border-[#EEF2F0]">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
                  <tr>
                    <th className="px-4 py-3">Campaign name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Audience</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <AdminEmptyState
                          title="No campaigns yet"
                          description="Use quick actions above to create your first campaign."
                          className="m-4 border-none bg-transparent"
                        />
                      </td>
                    </tr>
                  ) : (
                    campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-t border-[#EEF2F0]">
                        <td className="px-4 py-4 font-semibold text-[#0A4A4A]">{campaign.name}</td>
                        <td className="px-4 py-4">{campaign.campaignTypeLabel || campaign.campaignType}</td>
                        <td className="px-4 py-4">{campaign.audienceLabel}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${STATUS_TONES[campaign.status] || STATUS_TONES.draft}`}>
                            {STATUS_LABELS[campaign.status] || campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[#5C7571]">{formatDate(campaign.createdAt)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => setViewCampaign(campaign)} className="inline-flex items-center gap-1 rounded-full border border-[#0A4A4A]/20 px-3 py-1 text-xs font-semibold text-[#0A4A4A]">
                              <FiEye /> View
                            </button>
                            <button type="button" onClick={() => handleDuplicate(campaign)} disabled={isProcessing} className="inline-flex items-center gap-1 rounded-full border border-[#E6ECEA] px-3 py-1 text-xs font-semibold">
                              <FiCopy /> Duplicate
                            </button>
                            {campaign.status === "draft" && canSend ? (
                              <button type="button" onClick={() => handleSend(campaign)} disabled={isProcessing} className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-semibold text-white">
                                <FiSend /> Send
                              </button>
                            ) : campaign.status === "sent" && canSend ? (
                              <button type="button" onClick={() => handleDuplicate(campaign).then(() => toast.success("Duplicate created — send from drafts"))} className="inline-flex items-center gap-1 rounded-full border border-[#F59E0B]/30 px-3 py-1 text-xs font-semibold text-[#B45309]">
                                Send again
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        )}

        {tab === "history" && (
          <AdminPanel>
            <h2 className="mb-4 font-cormorant text-[22px] font-bold text-[#0A4A4A]">Message history</h2>
            <div className="overflow-x-auto rounded-[16px] border border-[#EEF2F0]">
              <table className="min-w-[800px] w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
                  <tr>
                    <th className="px-4 py-3">Campaign</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Audience</th>
                    <th className="px-4 py-3">Sent count</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-[#7A928D]">No sent messages yet.</td>
                    </tr>
                  ) : (
                    history.map((row) => (
                      <tr key={row.id} className="border-t border-[#EEF2F0]">
                        <td className="px-4 py-4 font-medium">{row.name}</td>
                        <td className="px-4 py-4">{row.campaignTypeLabel}</td>
                        <td className="px-4 py-4">{row.audienceLabel}</td>
                        <td className="admin-num px-4 py-4 font-semibold">{row.sentCount}</td>
                        <td className="px-4 py-4">{formatDate(row.sentAt || row.createdAt)}</td>
                        <td className="px-4 py-4">{STATUS_LABELS[row.status]}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        )}

        {tab === "testimonials" && requestPanel("testimonial_request", "Testimonial request center")}
        {tab === "recommendations" && requestPanel("recommendation_request", "Recommendation request center")}

        {tab === "announcements" && (
          <div className="grid gap-5 xl:grid-cols-2">
            <AdminPanel>
              <h2 className="font-cormorant text-[22px] font-bold text-[#0A4A4A]">Announcement center</h2>
              <form onSubmit={handleAnnouncement} className="mt-4 space-y-3">
                <input
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Announcement title"
                  className="w-full rounded-xl border border-[#E6ECEA] px-4 py-3 text-sm"
                  required
                />
                <textarea
                  value={announcementForm.messageBody}
                  onChange={(e) => setAnnouncementForm((p) => ({ ...p, messageBody: e.target.value }))}
                  placeholder="Announcement message"
                  rows={4}
                  className="w-full rounded-xl border border-[#E6ECEA] px-4 py-3 text-sm"
                  required
                />
                <input
                  type="datetime-local"
                  value={announcementForm.scheduledAt}
                  onChange={(e) => setAnnouncementForm((p) => ({ ...p, scheduledAt: e.target.value }))}
                  className="w-full rounded-xl border border-[#E6ECEA] px-4 py-3 text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={announcementForm.pinned}
                    onChange={(e) => setAnnouncementForm((p) => ({ ...p, pinned: e.target.checked }))}
                  />
                  Pin announcement
                </label>
                <button type="submit" disabled={isProcessing} className="rounded-full bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white">
                  Create announcement
                </button>
              </form>
            </AdminPanel>
            <AdminPanel>
              <h2 className="mb-4 font-cormorant text-[22px] font-bold text-[#0A4A4A]">Active announcements</h2>
              {announcements.length === 0 ? (
                <p className="text-sm text-[#7A928D]">No announcements yet.</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#0A4A4A]">{item.title}</h3>
                        {item.pinned ? (
                          <span className="rounded-full bg-[#FFF6E8] px-2 py-0.5 text-[10px] font-bold text-[#B45309]">
                            PINNED
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-[#5C7571]">{item.messageBody}</p>
                      <p className="mt-2 text-xs text-[#7A928D]">{formatDate(item.createdAt)}</p>
                    </article>
                  ))}
                </div>
              )}
            </AdminPanel>
          </div>
        )}

      <AdminConfirmDialog {...dialogProps} />

      <CreateCampaignModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalPreset({});
          refetch();
        }}
        preset={modalPreset}
        filterOptions={filterOptions}
      />

      <AdminModal
        open={Boolean(viewCampaign)}
        onClose={() => setViewCampaign(null)}
        title={viewCampaign?.name || "Campaign"}
        size="md"
        footer={
          <div className="flex justify-end">
            <AdminButton onClick={() => setViewCampaign(null)}>Close</AdminButton>
          </div>
        }
      >
        {viewCampaign ? (
          <div className="space-y-2 text-sm text-[#5C7571]">
            <p><strong>Type:</strong> {viewCampaign.campaignTypeLabel}</p>
            <p><strong>Channel:</strong> {viewCampaign.channelLabel}</p>
            <p><strong>Audience:</strong> {viewCampaign.audienceLabel}</p>
            <p><strong>Status:</strong> {STATUS_LABELS[viewCampaign.status]}</p>
            <p><strong>Recipients:</strong> {viewCampaign.recipientCount}</p>
            <p className="whitespace-pre-wrap"><strong>Message:</strong> {viewCampaign.messageBody}</p>
          </div>
        ) : null}
      </AdminModal>
    </AdminPageShell>
  );
}
