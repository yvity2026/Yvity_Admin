"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import { useAdminPageTitle } from "@/context/AdminPageTitleContext";
import { useUser, useUserActions } from "@/hooks/TanstankQuery/useUsers";
import { getUserQuickActions } from "@/lib/admin/users/userQuickActions";
import UserQuickActionsRail from "./UserQuickActionsRail";
import UsersSkeleton from "./UsersSkeleton";
import { AdminConfirmDialog, AdminErrorState, useConfirmDialog } from "@/components/admin/ui";

const STATUS_STYLES = {
  active: "bg-[#E8F5F0] text-[#1A7A5A]",
  suspended: "bg-[#FFF6E8] text-[#B45309]",
  deleted: "bg-[#FFF1F0] text-[#DC2626]",
};

const ACTIVITY_TONES = {
  success: "bg-[#E8F5F0] text-[#1A7A5A]",
  warning: "bg-[#FFF6E8] text-[#B45309]",
  info: "bg-[#E8F4F3] text-[#0A4A4A]",
  gold: "bg-[#FEF3E2] text-[#B45309]",
};

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

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F1F5F4] py-3 last:border-0">
      <span className="text-[12px] font-medium text-[#7A928D]">{label}</span>
      <span className="admin-num text-right text-[13px] font-semibold text-[#183534]">{value}</span>
    </div>
  );
}

function Panel({ title, eyebrow, children }) {
  return (
    <section className="rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
      {eyebrow && (
        <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-cormorant text-[22px] font-bold text-[#0A4A4A]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function UserDetailView({ userId }) {
  const { data, isLoading, isError, error, refetch } = useUser(userId);
  const userActions = useUserActions();
  const { confirm, dialogProps } = useConfirmDialog();
  const { setPageTitle } = useAdminPageTitle();
  const user = data?.data;

  useEffect(() => {
    setPageTitle(user?.name || null);
    return () => setPageTitle(null);
  }, [user?.name, setPageTitle]);

  const quickActions = getUserQuickActions(user);

  const handleAction = async (action) => {
    if (!action.action) return;

    const { confirmed } = await confirm({
      title: action.action === "delete" ? "Delete user" : action.label,
      message:
        action.action === "delete"
          ? "Delete this user? This is a soft delete."
          : `${action.label}?`,
      confirmLabel: action.action === "delete" ? "Delete" : "Confirm",
      variant: action.action === "activate" ? "primary" : "danger",
    });

    if (!confirmed) return;

    try {
      await userActions.mutateAsync({ id: userId, action: action.action });
      toast.success("User updated");
      refetch();
    } catch (actionError) {
      toast.error(actionError.message || "Action failed");
    }
  };

  if (isLoading) {
    return <UsersSkeleton detail />;
  }

  if (isError || !user) {
    return (
      <AdminErrorState
        title="User not found"
        message={error?.message}
        action={
          <Link
            href="/admin/users"
            className="rounded-full bg-[#0A4A4A] px-5 py-2 text-sm font-semibold text-white"
          >
            Back to users
          </Link>
        }
      />
    );
  }

  const summary = user.activitySummary || {};

  return (
    <div className="min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-full border border-[#D7E5E1] bg-white px-4 py-2 text-[12px] font-semibold text-[#0A4A4A]"
          >
            <FiArrowLeft size={14} />
            Back
          </Link>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${STATUS_STYLES[user.status] || STATUS_STYLES.active}`}
          >
            {user.statusLabel}
          </span>
          <span className="rounded-full bg-[#E8F4F3] px-3 py-1 text-[11px] font-bold uppercase text-[#0A4A4A]">
            {user.userTypeLabel}
          </span>
        </div>

        <div className="xl:hidden">
          <UserQuickActionsRail
            actions={quickActions}
            onAction={handleAction}
            loading={userActions.isPending}
            variant="sheet"
          />
        </div>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1 space-y-5">
            <section className="overflow-hidden rounded-[26px] border border-[#0A4A4A]/10 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-[#F59E0B] text-xl font-bold text-white">
                  {user.profilePic ? (
                    <Image
                      src={user.profilePic}
                      alt={user.name}
                      fill
                      sizes="64px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      {(user.name || "U").slice(0, 1)}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="font-cormorant text-[32px] font-bold text-[#0A4A4A]">{user.name}</h1>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-[#5C7571]">
                    <FiMapPin size={13} className="text-[#F59E0B]" />
                    {user.city || "Unknown city"}
                  </p>
                </div>
              </div>
            </section>

            <Panel title="Basic information" eyebrow="Profile">
              <InfoRow label="Name" value={user.name} />
              <InfoRow label="User ID" value={user.shortId} />
              <InfoRow label="User type" value={user.userTypeLabel} />
              <InfoRow label="Plan" value={user.plan} />
              <InfoRow label="Status" value={user.statusLabel} />
              <InfoRow label="Phone" value={user.phoneMasked} />
              <InfoRow label="Email" value={user.emailMasked} />
              <InfoRow label="Registration date" value={formatDate(user.registeredAt)} />
              <InfoRow label="Last login" value={formatDate(user.lastLogin)} />
            </Panel>

            {user.subscription && (
              <Panel title="Subscription" eyebrow="Billing">
                <InfoRow label="Current plan" value={user.subscription.currentPlan} />
                <InfoRow label="Plan start date" value={formatDate(user.subscription.startDate)} />
                <InfoRow label="Plan expiry date" value={formatDate(user.subscription.expiryDate)} />
                <div className="mt-4 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
                    Upgrade history
                  </p>
                  {user.subscription.upgradeHistory?.length ? (
                    user.subscription.upgradeHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-3 py-3"
                      >
                        <span className="text-[12px] font-semibold capitalize text-[#183534]">
                          {item.plan}
                        </span>
                        <span className="admin-num text-[12px] text-[#5C7571]">
                          {formatDate(item.paidAt)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] text-[#7A928D]">No upgrade history yet</p>
                  )}
                </div>
              </Panel>
            )}

            <Panel title="Activity summary" eyebrow="Engagement">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#E8F4F3] px-3 py-3">
                  <p className="text-[11px] text-[#7A928D]">Saved profiles</p>
                  <p className="admin-num mt-1 text-[24px] font-bold text-[#0A4A4A]">
                    {summary.savedProfiles ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FFF6E8] px-3 py-3">
                  <p className="text-[11px] text-[#7A928D]">Recommendations</p>
                  <p className="admin-num mt-1 text-[24px] font-bold text-[#B45309]">
                    {summary.recommendationsGiven ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] px-3 py-3">
                  <p className="text-[11px] text-[#7A928D]">Reviews submitted</p>
                  <p className="admin-num mt-1 text-[24px] font-bold text-[#334155]">
                    {summary.reviewsSubmitted ?? 0}
                  </p>
                </div>
                {user.userType === "professional" && (
                  <div className="rounded-2xl bg-[#E8F5F0] px-3 py-3">
                    <p className="text-[11px] text-[#7A928D]">Profile views</p>
                    <p className="admin-num mt-1 text-[24px] font-bold text-[#1A7A5A]">
                      {summary.profileViews ?? 0}
                    </p>
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="Recent user activity" eyebrow="Timeline">
              <div className="space-y-2">
                {user.activity?.length ? (
                  user.activity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-3 py-3"
                    >
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F59E0B]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-semibold text-[#183534]">{item.title}</p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ACTIVITY_TONES[item.tone]}`}
                          >
                            new
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#5C7571]">{item.detail}</p>
                        <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#9AB0AB]">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-[#7A928D]">No recent activity recorded</p>
                )}
              </div>
            </Panel>
          </div>

          <aside className="hidden w-full shrink-0 xl:block xl:w-[300px]">
            <UserQuickActionsRail
              actions={quickActions}
              onAction={handleAction}
              loading={userActions.isPending}
              variant="rail"
            />
          </aside>
        </div>
      </div>
      <AdminConfirmDialog {...dialogProps} />
    </div>
  );
}
