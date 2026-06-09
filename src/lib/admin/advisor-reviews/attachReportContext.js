import { mapComplaintReason } from "@/lib/admin/complaints/mapComplaintRecord";
import { maskComplaintReporter } from "@/lib/pii/complaintContact";

function pickLatestReport(reports = []) {
  if (!reports.length) return null;
  return reports
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
}

function mapReportSummary(complaint) {
  if (!complaint) return null;

  const reporter = maskComplaintReporter(complaint);

  return {
    complaintId: complaint.id,
    caseNumber: complaint.case_number || null,
    reportedBy: reporter.name || "Anonymous",
    reportedByPhoneMasked: reporter.phone || "—",
    reportReason: complaint.reason || "other",
    reportReasonLabel:
      complaint.reason === "harassment" ? "Abuse" : mapComplaintReason(complaint.reason),
    reportDescription: complaint.description || "",
    reportStatus: complaint.status || "open",
    reportedAt: complaint.created_at || null,
    reporterUserId: complaint.reporter_user_id || null,
  };
}

export function mergeReviewWithReport(review, reports = []) {
  const latest = pickLatestReport(reports);
  const report = mapReportSummary(latest);
  const reportCount = Math.max(review.reportedCount || 0, reports.length);

  let moderationStatus = "resolved";
  let moderationStatusLabel = "Resolved";

  if (review.visibility === "hidden") {
    moderationStatus = "hidden";
    moderationStatusLabel = "Hidden";
  } else if (reportCount > 0 && review.visibility === "public") {
    moderationStatus = "reported";
    moderationStatusLabel = "Reported";
  } else if (report?.reportStatus === "resolved" || report?.reportStatus === "dismissed") {
    moderationStatus = "resolved";
    moderationStatusLabel = "Resolved";
  }

  const needsAction =
    review.visibility === "public" &&
    (reportCount > 0 || ["open", "in_review"].includes(report?.reportStatus));

  return {
    ...review,
    reportedCount: reportCount,
    latestReport: report,
    reportedBy: report?.reportedBy || "—",
    reportReason: report?.reportReason || null,
    reportReasonLabel: report?.reportReasonLabel || "—",
    reportDescription: report?.reportDescription || "",
    reportedAt: report?.reportedAt || review.submittedAt,
    reporterUserId: report?.reporterUserId || null,
    moderationStatus,
    moderationStatusLabel,
    needsAction,
    complaintId: report?.complaintId || null,
    caseNumber: report?.caseNumber || null,
  };
}

export async function fetchSupabaseReportsByReviewIds(supabase, reviewIds = []) {
  if (!reviewIds.length) return new Map();

  const { data, error } = await supabase
    .from("platform_complaints")
    .select(
      "id, case_number, entity_id, reason, description, status, reporter_name, reporter_phone_last4, reporter_user_id, created_at",
    )
    .eq("entity_type", "advisor_testimonial")
    .in("entity_id", reviewIds);

  if (error) {
    console.warn("[advisor-reviews] complaints lookup failed:", error.message);
    return new Map();
  }

  const byReview = new Map();
  for (const row of data || []) {
    const key = row.entity_id;
    if (!key) continue;
    const list = byReview.get(key) || [];
    list.push(row);
    byReview.set(key, list);
  }

  return byReview;
}

export function attachReportsToReviews(reviews = [], reportsByReviewId = new Map()) {
  return reviews.map((review) =>
    mergeReviewWithReport(review, reportsByReviewId.get(review.id) || []),
  );
}
