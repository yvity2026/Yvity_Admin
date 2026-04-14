import WelcomeCard from "@/components/features/advisor/dashboard/welcome-card";
import ProfileProgress from "@/components/features/advisor/dashboard/profile-progress";
import StatsCards from "@/components/features/advisor/dashboard/stats-cards";
import ScoreSection from "@/components/features/advisor/dashboard/score-section";
import Analytics from "@/components/features/advisor/dashboard/analytics";
import QuickActions from "@/components/features/advisor/dashboard/quick-actions";
import ImproveScore from "@/components/features/advisor/dashboard/improve-score";
import RecentActivity from "@/components/features/advisor/dashboard/recent-activity";

export default function AdvisorDashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      <ProfileProgress />
      <StatsCards />

      {/* Score + Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreSection />
        <Analytics />
      </div>

      <QuickActions />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImproveScore />
        <RecentActivity />
      </div>
    </div>
  );
}