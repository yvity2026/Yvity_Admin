export const AGE_BUCKETS = [
  { id: "18-25", min: 18, max: 25 },
  { id: "26-35", min: 26, max: 35 },
  { id: "36-45", min: 36, max: 45 },
  { id: "46-60", min: 46, max: 60 },
  { id: "60+", min: 61, max: 200 },
];

export const SCORE_BUCKETS = [
  { id: "90+", min: 90, max: 100 },
  { id: "80-89", min: 80, max: 89 },
  { id: "70-79", min: 70, max: 79 },
  { id: "60-69", min: 60, max: 69 },
  { id: "50-59", min: 50, max: 59 },
  { id: "Below 50", min: 0, max: 49 },
];

export function toIsoDate(value) {
  if (!value) return null;
  if (typeof value === "number") return new Date(value).toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function parseDate(value) {
  const iso = toIsoDate(value);
  return iso ? new Date(iso) : null;
}

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export function isWithinRange(iso, from, to) {
  const date = parseDate(iso);
  if (!date) return false;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

export function ageFromDob(dob) {
  const birth = parseDate(dob);
  if (!birth) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function bucketAge(age) {
  if (age == null || age < 18) return "Unknown";
  for (const bucket of AGE_BUCKETS) {
    if (age >= bucket.min && age <= bucket.max) return bucket.id;
  }
  return "Unknown";
}

export function bucketScore(score) {
  for (const bucket of SCORE_BUCKETS) {
    if (score >= bucket.min && score <= bucket.max) return bucket.id;
  }
  return "Below 50";
}

export function countBy(items, keyFn, labelFn = keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item) || "Unknown";
    const label = labelFn(item) || key;
    const existing = map.get(key) || { id: key, label, count: 0 };
    existing.count += 1;
    map.set(key, existing);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function topN(rows, n = 10) {
  return rows.slice(0, n);
}

export function growthRate(current, previous) {
  const c = Number(current) || 0;
  const p = Number(previous) || 0;
  if (p === 0) return c > 0 ? 100 : 0;
  return Math.round(((c - p) / p) * 100);
}

export function formatINR(amount) {
  const value = Math.round(Number(amount) || 0);
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatINRCompact(amount) {
  const value = Number(amount) || 0;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return formatINR(value);
}

export function buildDailySeries(items, dateKey, days = 30) {
  const buckets = [];
  const now = startOfDay();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    buckets.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      count: 0,
    });
  }
  const map = new Map(buckets.map((b) => [b.date, b]));
  for (const item of items) {
    const iso = toIsoDate(dateKey(item));
    if (!iso) continue;
    const key = iso.slice(0, 10);
    const bucket = map.get(key);
    if (bucket) bucket.count += 1;
  }
  return buckets;
}

export function buildMonthlySeries(items, dateKey, months = 12) {
  const buckets = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      key,
      label: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      count: 0,
    });
  }
  const map = new Map(buckets.map((b) => [b.key, b]));
  for (const item of items) {
    const iso = toIsoDate(dateKey(item));
    if (!iso) continue;
    const d = new Date(iso);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = map.get(key);
    if (bucket) bucket.count += 1;
  }
  return buckets;
}

export function normalizeIndustry(value = "") {
  const text = String(value).toLowerCase();
  if (/insurance|bank|loan|mutual|financial|bfsi|lic|hdfc|sbi|icici/.test(text)) return "BFSI";
  if (/real\s*estate|property|builder/.test(text)) return "Real Estate";
  if (/legal|lawyer|advocate/.test(text)) return "Legal";
  if (/health|medical|hospital|doctor/.test(text)) return "Healthcare";
  if (/education|teacher|coach|trainer/.test(text)) return "Education";
  return "Others";
}

export function serviceCategoryLabel(category = "") {
  const key = String(category).toLowerCase();
  if (key === "life") return "Life Insurance";
  if (key === "health") return "Health Insurance";
  if (key === "general") return "General Insurance";
  if (key === "mutual") return "Mutual Funds";
  return category || "Other";
}

export function industryCategoryFromService(category = "") {
  const key = String(category).toLowerCase();
  if (key === "mutual") return "Financial Planning";
  if (["life", "health", "general"].includes(key)) return "Insurance";
  return "Other";
}

export function exportRowsToCsv(filename, rows, columns) {
  if (typeof window === "undefined") return;
  const header = columns.map((col) => col.label).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((col) => {
          const value = row[col.key] ?? "";
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
