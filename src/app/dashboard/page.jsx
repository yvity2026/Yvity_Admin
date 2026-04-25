import Header from "@/components/features/user/landing/Header";
import AdvisorSearchFilter from "@/components/features/user/landing/HeroSection";
import LandingPopup from "@/components/features/user/landing/LandingPopup";
import SavedProfiles from "@/components/features/user/landing/SavedProfiles";
import { headers, cookies } from "next/headers";
import React from "react";

export const metadata = {
  title: "YVITY Dashboard",
  description: "Overview of your dashboard",
};

const normalizeTag = (value) => {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized.includes("life")) return "Life Insurance";
  if (normalized.includes("health")) return "Health Insurance";
  if (normalized.includes("mdrt")) return "MDRT";
  if (normalized.includes("found")) return "Founding";

  return null;
};

const getTagsFromAdvisor = (advisor) => {
  const directTags = Array.isArray(advisor?.tags) ? advisor.tags : [];
  const services = Array.isArray(advisor?.services) ? advisor.services : [];

  const serviceTags = services
    .flatMap((service) => [
      service?.service,
      service?.service_type,
      service?.name,
      service?.category,
    ])
    .map(normalizeTag)
    .filter(Boolean);

  const tags = [...directTags, ...serviceTags]
    .map(normalizeTag)
    .filter(Boolean);

  return [...new Set(tags)];
};

const normalizeAdvisor = (advisor, index) => {
  const tags = getTagsFromAdvisor(advisor);

  return {
    id: advisor?.id || `advisor-${index}`,
    name: advisor?.name || "Advisor",
    title: advisor?.title || advisor?.profession || "Insurance Advisor",
    location: advisor?.location || advisor?.city || "",
    score: Number(advisor?.score) || 80,
    scoreLabel: advisor?.scoreLabel || "Verified Advisor",
    exp: advisor?.exp || "0+",
    reviews: Number(advisor?.reviews) || 0,
    recs: Number(advisor?.recs) || 0,
    clients: advisor?.clients || "0+",
    tags: tags.length ? tags : ["Life Insurance"],
    selfie_url: advisor?.selfie_url || "",
  };
};

const getAdvisors = async () => {
  try {
    const headerStore = await headers();
    const cookieStore = await cookies();
    const host = headerStore.get("host") || "localhost:3001"
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    if (!host) {
      return [];
    }

    const res = await fetch(`api/customer/advisor`, {
      method: "GET",
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return [];
    }

    const advisors = Array.isArray(result?.data) ? result.data : [];
    return advisors.map(normalizeAdvisor);
  } catch (error) {
    console.error("Dashboard advisor fetch failed:", error);
    return [];
  }
};

const page = async () => {
  const advisors = await getAdvisors();

  return (
    <>
      <Header />
      <LandingPopup />
      <AdvisorSearchFilter advisors={advisors} />
      <SavedProfiles />
    </>
  );
};

export default page;
