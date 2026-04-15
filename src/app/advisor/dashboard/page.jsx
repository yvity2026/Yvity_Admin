// import WelcomeCard from "@/components/features/advisor/dashboard/welcome-card";
// import ProfileProgress from "@/components/features/advisor/dashboard/profile-progress";
// import StatsCards from "@/components/features/advisor/dashboard/stats-cards";
// import ScoreSection from "@/components/features/advisor/dashboard/score-section";
// import Analytics from "@/components/features/advisor/dashboard/analytics";
// import QuickActions from "@/components/features/advisor/dashboard/quick-actions";
// import ImproveScore from "@/components/features/advisor/dashboard/improve-score";
// import RecentActivity from "@/components/features/advisor/dashboard/recent-activity";

// export default function AdvisorDashboardPage() {
//   return (
   
//     <div className="space-y-6 p-4 bg-[#F8F6F1] w-full">
//       <WelcomeCard />
//       <ProfileProgress />
//       <StatsCards />

//       {/* Score + Analytics */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ScoreSection />
//         <Analytics />
//       </div>

//       <QuickActions />

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ImproveScore />
//         <RecentActivity />
//       </div>
//     </div>
  
//   );
// }


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
    <div className="space-y-6 p-6 bg-[#F8F6F1] min-h-screen w-full">
      <div className="max-w-7xl mx-auto space-y-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
          <ImproveScore />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}