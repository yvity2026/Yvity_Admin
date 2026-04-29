"use client";
import { useEffect, useState } from "react";

// Actual Components
// import DashboardHeader from "@/components/features/advisor/dashboard/dashboard-header";


// Shimmers
import WelcomeCardShimmer from "./shimmers/WelcomeCardShimmer";
import ProfileProgressShimmer from "./shimmers/ProfileProgressShimmer";
import StatsCardsShimmer from "./shimmers/StatsCardsShimmer";
import ScoreSectionShimmer from "./shimmers/ScoreSectionShimmer";
import AnalyticsShimmer from "./shimmers/AnalyticsShimmer";
import QuickActionsShimmer from "./shimmers/QuickActionsShimmer";
import ImproveScoreShimmer from "./shimmers/ImproveScoreShimmer";
import RecentActivityShimmer from "./shimmers/RecentActivityShimmer";
import DashboardHeaderShimmer from "./shimmers/dashboard-header-shimmer";
import WelcomeCard from "@/components/features/advisor/dashboard/welcome-card";
import ProfileProgress from "@/components/features/advisor/dashboard/profile-progress";
import StatsCards from "@/components/features/advisor/dashboard/stats-cards";
import ScoreSection from "@/components/features/advisor/dashboard/score-section";
import Analytics from "@/components/features/advisor/dashboard/analytics";
import QuickActions from "@/components/features/advisor/dashboard/quick-actions";
import ImproveScore from "@/components/features/advisor/dashboard/improve-score";
import RecentActivity from "@/components/features/advisor/dashboard/recent-activity";

export default function AdvisorDashboardPage() {
const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/advisor/dashboard");
      const data = await res.json();

      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      {/* <DashboardHeader /> */}
      {/* {isLoading ? <DashboardHeaderShimmer /> : <DashboardHeader />} */}

      {/* 2. Main Content Area */}
      <div className="p-6">
        <div className="mx-auto space-y-6">
          {/* <WelcomeCard />
          <ProfileProgress />
          <StatsCards /> */}
          {isLoading ? <WelcomeCardShimmer /> : <WelcomeCard data={dashboardData}/>}
          {isLoading ? <ProfileProgressShimmer /> : <ProfileProgress data={dashboardData}/>}
          {isLoading ? <StatsCardsShimmer /> : <StatsCards data={dashboardData}/>}

          {/* Score + Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* <ScoreSection />
            <Analytics /> */}
            {isLoading ? <ScoreSectionShimmer /> : <ScoreSection data={dashboardData}/>}
            {isLoading ? <AnalyticsShimmer /> : <Analytics data={dashboardData}/>}
          </div>
          {/* <QuickActions /> */}

          {isLoading ? <QuickActionsShimmer /> : <QuickActions data={dashboardData}/>}

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
            {/* <ImproveScore />
            <RecentActivity /> */}
            {isLoading ? <ImproveScoreShimmer /> : <ImproveScore data={dashboardData}/>}
            {isLoading ? <RecentActivityShimmer /> : <RecentActivity data={dashboardData}/>}
          </div>
        </div>
      </div>
    </div>
  );
}
