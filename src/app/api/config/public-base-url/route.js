import { NextResponse } from "next/server";

function normalizeBaseUrl(rawUrl, isProduction) {
  if (!rawUrl) {
    return "";
  }

  const trimmedUrl = rawUrl.trim().replace(/\/+$/, "");

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  const protocol = isProduction ? "https" : "http";
  return `${protocol}://${trimmedUrl}`;
}

export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";
  const rawBaseUrl = isProduction
    ? process.env.DASHBOARD_PRODUCTION_URL
    : process.env.DASHBOARD_LOCAL_URL;

  return NextResponse.json({
    baseUrl: normalizeBaseUrl(rawBaseUrl, isProduction),
  });
}
