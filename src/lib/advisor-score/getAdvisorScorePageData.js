import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";

const SCORE_LIMITS = {
  total: 100,
  identity: 30,
  visibility: 30,
  trust: 40,
  selfie: 10,
  mobile: 5,
  irda: 5,
  introVideo: 10,
  publicProfile: 10,
  selfShare: 5,
  clientShare: 5,
  profileStrength: 5,
  loginActivity: 5,
  testimonials: 15,
  recommendations: 15,
  achievements: 10,
  textTestimonials: 2,
  audioTestimonials: 4,
  videoTestimonials: 9,
};

function createEmptyState() {
  return {
    isAuthenticated: false,
    advisor: null,
    profile: null,
    refreshedAt: null,
    score: {
      total: 0,
      max: SCORE_LIMITS.total,
      identity: 0,
      visibility: 0,
      trust: 0,
    },
    identity: {
      total: 0,
      max: SCORE_LIMITS.identity,
      selfie: 0,
      mobile: 0,
      irda: 0,
      introVideo: 0,
      missingIntroVideoPoints: SCORE_LIMITS.introVideo,
    },
    visibility: {
      total: 0,
      max: SCORE_LIMITS.visibility,
      publicProfile: 0,
      selfShare: 0,
      selfShareCount: 0,
      remainingSelfShares: 25,
      clientShare: 0,
      clientShareCount: 0,
      remainingClientShares: 5,
      profileStrength: 0,
      loginActivity: 0,
      activeDays: 0,
      profileStrengthChecks: [],
    },
    trust: {
      total: 0,
      max: SCORE_LIMITS.trust,
      testimonials: 0,
      recommendations: 0,
      achievements: 0,
      testimonialBreakdown: {
        text: { count: 0, points: 0, max: SCORE_LIMITS.textTestimonials },
        audio: { count: 0, points: 0, max: SCORE_LIMITS.audioTestimonials },
        video: { count: 0, points: 0, max: SCORE_LIMITS.videoTestimonials },
      },
      recommendationCount: 0,
      recommendationBasePoints: 0,
      recommendationBonusPoints: 0,
      hasContinuityBonus: false,
      latestAchievement: null,
    },
    improvements: [],
  };
}

function getAchievementYear(achievement) {
  return Number(
    achievement?.achievement_year ??
      achievement?.to_year ??
      achievement?.from_year ??
      0
  );
}

function getAchievementPoints(type) {
  if (type === "TOT") return 10;
  if (type === "COT") return 8;
  if (type === "MDRT") return 2;
  return 0;
}

function buildPageData({
  advisor,
  profile,
  scoreRow,
  serviceItems,
  testimonials,
  recommendations,
  achievements,
  galleryItems,
  shareEvents,
  loginActivity,
}) {
  const approvedTestimonials = testimonials.filter(
    (item) => item.status === "approved"
  );
  const approvedRecommendations = recommendations.filter(
    (item) => item.status === "approved"
  );

  const textCount = approvedTestimonials.filter(
    (item) => item.testimonial_type === "text"
  ).length;
  const audioCount = approvedTestimonials.filter(
    (item) => item.testimonial_type === "audio"
  ).length;
  const videoCount = approvedTestimonials.filter(
    (item) => item.testimonial_type === "video"
  ).length;

  const textPoints = Math.min(textCount, SCORE_LIMITS.textTestimonials);
  const audioPoints = Math.min(audioCount * 2, SCORE_LIMITS.audioTestimonials);
  const videoPoints = Math.min(videoCount * 3, SCORE_LIMITS.videoTestimonials);

  const recentRecommendationCount = approvedRecommendations.filter((item) => {
    if (!item?.created_at) return false;
    const createdAt = new Date(item.created_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return createdAt >= sixMonthsAgo;
  }).length;

  const recommendationBasePoints = Math.min(
    approvedRecommendations.length * 2,
    14
  );
  const recommendationBonusPoints = recentRecommendationCount > 0 ? 1 : 0;

  const latestAchievement = [...achievements].sort(
    (left, right) => getAchievementYear(right) - getAchievementYear(left)
  )[0];
  const achievementPoints = latestAchievement
    ? getAchievementPoints(latestAchievement.achievement_type)
    : 0;
  const galleryPhotoCount = galleryItems.length;

  const profileStrengthChecks = [
    {
      label: "Professional journey added",
      complete: false,
    },
    {
      label: "Services added",
      complete: serviceItems.length > 0,
    },
    {
      label: "Achievements added",
      complete: achievements.length > 0,
    },
    {
      label: "Testimonials received",
      complete: approvedTestimonials.length > 0,
    },
    {
      label: "Gallery photos added",
      complete: galleryPhotoCount > 0,
    },
  ];

  const calculatedIdentity = {
    selfie: advisor?.selfie_url ? SCORE_LIMITS.selfie : 0,
    mobile:
      (advisor?.mobile_verified ? 3 : 0) + (advisor?.email_verified ? 2 : 0),
    irda: profile?.is_verified ? SCORE_LIMITS.irda : 0,
    introVideo: profile?.intro_url ? SCORE_LIMITS.introVideo : 0,
  };

  const selfShareCount = shareEvents.filter(
    (item) => item.share_type === "self"
  ).length;
  const clientShareCount = shareEvents.filter(
    (item) => item.share_type === "client"
  ).length;

  const calculatedVisibility = {
    publicProfile: profile?.ispublic_profile ? SCORE_LIMITS.publicProfile : 0,
    selfShare: Math.min(Math.floor(selfShareCount / 5), SCORE_LIMITS.selfShare),
    clientShare: Math.min(clientShareCount, SCORE_LIMITS.clientShare),
    profileStrength: profileStrengthChecks.filter((item) => item.complete).length,
    loginActivity: Math.min(loginActivity.length, SCORE_LIMITS.loginActivity),
  };

  const calculatedTrust = {
    testimonials: textPoints + audioPoints + videoPoints,
    recommendations: Math.min(
      recommendationBasePoints + recommendationBonusPoints,
      SCORE_LIMITS.recommendations
    ),
    achievements: achievementPoints,
  };

  const identity = {
    total:
      scoreRow?.identity_total ??
      Object.values(calculatedIdentity).reduce((sum, value) => sum + value, 0),
    max: SCORE_LIMITS.identity,
    selfie: scoreRow?.selfie_pts ?? calculatedIdentity.selfie,
    mobile:
      scoreRow?.mobile_pts !== undefined || scoreRow?.email_pts !== undefined
        ? (scoreRow?.mobile_pts ?? 0) + (scoreRow?.email_pts ?? 0)
        : calculatedIdentity.mobile,
    irda: scoreRow?.irda_pts ?? calculatedIdentity.irda,
    introVideo: scoreRow?.intro_video_pts ?? calculatedIdentity.introVideo,
    missingIntroVideoPoints: Math.max(
      SCORE_LIMITS.introVideo -
        (scoreRow?.intro_video_pts ?? calculatedIdentity.introVideo),
      0
    ),
  };

  const visibilityPublicProfile =
    scoreRow?.public_profile_pts ?? calculatedVisibility.publicProfile;
  const visibilitySelfShare =
    scoreRow?.self_share_pts ?? calculatedVisibility.selfShare;
  const visibilityClientShare =
    scoreRow?.client_share_pts ?? calculatedVisibility.clientShare;
  const visibilityProfileStrength = calculatedVisibility.profileStrength;
  const visibilityLoginActivity = calculatedVisibility.loginActivity;

  const visibility = {
    total:
      visibilityPublicProfile +
      visibilitySelfShare +
      visibilityClientShare +
      visibilityProfileStrength +
      visibilityLoginActivity,
    max: SCORE_LIMITS.visibility,
    publicProfile: visibilityPublicProfile,
    selfShare: visibilitySelfShare,
    selfShareCount,
    remainingSelfShares: Math.max(25 - selfShareCount, 0),
    clientShare: visibilityClientShare,
    clientShareCount,
    remainingClientShares: Math.max(5 - clientShareCount, 0),
    profileStrength: visibilityProfileStrength,
    loginActivity: visibilityLoginActivity,
    activeDays: loginActivity.length,
    profileStrengthChecks,
  };

  const trust = {
    total:
      scoreRow?.trust_total ??
      Object.values(calculatedTrust).reduce((sum, value) => sum + value, 0),
    max: SCORE_LIMITS.trust,
    testimonials: scoreRow?.testimonial_pts ?? calculatedTrust.testimonials,
    recommendations:
      scoreRow?.recommendation_pts ?? calculatedTrust.recommendations,
    achievements: scoreRow?.achievement_pts ?? calculatedTrust.achievements,
    testimonialBreakdown: {
      text: { count: textCount, points: textPoints, max: SCORE_LIMITS.textTestimonials },
      audio: { count: audioCount, points: audioPoints, max: SCORE_LIMITS.audioTestimonials },
      video: { count: videoCount, points: videoPoints, max: SCORE_LIMITS.videoTestimonials },
    },
    recommendationCount: approvedRecommendations.length,
    recommendationBasePoints,
    recommendationBonusPoints,
    hasContinuityBonus: recommendationBonusPoints > 0,
    latestAchievement: latestAchievement
      ? {
          type: latestAchievement.achievement_type,
          year: getAchievementYear(latestAchievement),
          points: achievementPoints,
        }
      : null,
  };

  const score = {
    total:
      identity.total + visibility.total + trust.total,
    max: SCORE_LIMITS.total,
    identity: identity.total,
    visibility: visibility.total,
    trust: trust.total,
  };

  const improvements = [];

  if (trust.testimonialBreakdown.video.points < SCORE_LIMITS.videoTestimonials) {
    const missingPoints =
      SCORE_LIMITS.videoTestimonials - trust.testimonialBreakdown.video.points;
    improvements.push({
      key: "video-testimonials",
      title: `Add ${Math.ceil(missingPoints / 3)} video testimonial${
        Math.ceil(missingPoints / 3) > 1 ? "s" : ""
      }`,
      points: missingPoints,
      cta: "Request",
    });
  }

  if (trust.recommendationBasePoints < 14) {
    const missingPoints = 14 - trust.recommendationBasePoints;
    improvements.push({
      key: "recommendations",
      title: `Get ${Math.ceil(missingPoints / 2)} more recommendation${
        Math.ceil(missingPoints / 2) > 1 ? "s" : ""
      }`,
      points: missingPoints,
      cta: "Share",
    });
  }

  if (!trust.hasContinuityBonus) {
    improvements.push({
      key: "continuity-bonus",
      title: "Maintain monthly recommendation activity",
      points: 1,
      cta: "Keep going",
    });
  }

  if (identity.introVideo < SCORE_LIMITS.introVideo) {
    improvements.push({
      key: "intro-video",
      title: "Add intro video to your profile",
      points: SCORE_LIMITS.introVideo - identity.introVideo,
      cta: "Add now",
    });
  }

  if (visibility.selfShare < SCORE_LIMITS.selfShare) {
    improvements.push({
      key: "self-shares",
      title: `Share profile ${visibility.remainingSelfShares} more time${
        visibility.remainingSelfShares === 1 ? "" : "s"
      }`,
      points: SCORE_LIMITS.selfShare - visibility.selfShare,
      cta: "Share",
    });
  }

  if (visibility.clientShare < SCORE_LIMITS.clientShare) {
    improvements.push({
      key: "client-shares",
      title: `Ask ${visibility.remainingClientShares} client${
        visibility.remainingClientShares === 1 ? "" : "s"
      } to share your profile`,
      points: SCORE_LIMITS.clientShare - visibility.clientShare,
      cta: "Invite",
    });
  }

  if (!visibility.publicProfile) {
    improvements.push({
      key: "public-profile",
      title: "Enable your public profile",
      points: SCORE_LIMITS.publicProfile,
      cta: "Enable",
    });
  }

  return {
    isAuthenticated: true,
    advisor,
    profile,
    refreshedAt:
      scoreRow?.updated_at ?? profile?.score_last_recalculated_at ?? null,
    score,
    identity,
    visibility,
    trust,
    improvements: improvements
      .sort((left, right) => right.points - left.points)
      .slice(0, 5),
  };
}

export async function getAdvisorScorePageData() {
  const sessionUser = await getUser();

  if (!sessionUser?.token) {
    return createEmptyState();
  }

  const supabase = createAdminClient();

  const { data: advisor, error: advisorError } = await supabase
    .from("users")
    .select("id,name,roles,mobile_verified,email_verified,selfie_url")
    .filter("device_tokens", "cs", JSON.stringify([{ token: sessionUser.token }]))
    .maybeSingle();

  if (advisorError || !advisor || !advisor.roles?.includes("advisor")) {
    return createEmptyState();
  }

  await recordAdvisorLoginActivity(supabase, advisor);

  const { data: profile, error: profileError } = await supabase
    .from("advisor_profiles")
    .select(
      "advisor_id,intro_url,is_verified,ispublic_profile,score_last_recalculated_at"
    )
    .eq("advisor_id", advisor.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      ...createEmptyState(),
      isAuthenticated: true,
      advisor,
    };
  }

  await supabase.rpc("recalculate_advisor_score", {
    p_advisor: advisor.id,
  });

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 6);

  const [
    scoreResult,
    servicesResult,
    testimonialsResult,
    recommendationsResult,
    achievementsResult,
    galleryResult,
    shareEventsResult,
    loginActivityResult,
  ] = await Promise.all([
    supabase
      .from("advisor_scores")
      .select("*")
      .eq("advisor_id", advisor.id)
      .maybeSingle(),
    supabase
      .from("advisor_services")
      .select("id")
      .eq("advisor_id", advisor.id),
    supabase
      .from("advisor_testimonials")
      .select("testimonial_type,status,created_at")
      .eq("advisor_id", advisor.id),
    supabase
      .from("advisor_recommendations")
      .select("status,created_at")
      .eq("advisor_id", advisor.id),
    supabase
      .from("advisor_achievements")
      .select("*")
      .eq("advisor_id", advisor.id),
    supabase
      .from("advisor_gallery")
      .select("id")
      .eq("advisor_id", advisor.id),
    supabase
      .from("advisor_share_events")
      .select("share_type,created_at")
      .eq("advisor_id", advisor.id),
    supabase
      .from("advisor_login_activity")
      .select("login_date")
      .eq("advisor_id", advisor.id)
      .gte("login_date", sinceDate.toISOString().slice(0, 10)),
  ]);

  return buildPageData({
    advisor,
    profile,
    scoreRow: scoreResult.data ?? null,
    serviceItems: servicesResult.data ?? [],
    testimonials: testimonialsResult.data ?? [],
    recommendations: recommendationsResult.data ?? [],
    achievements: achievementsResult.data ?? [],
    galleryItems: galleryResult.data ?? [],
    shareEvents: shareEventsResult.data ?? [],
    loginActivity: loginActivityResult.data ?? [],
  });
}
