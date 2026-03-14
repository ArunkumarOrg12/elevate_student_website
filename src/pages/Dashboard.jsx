import WelcomeSection from '../components/dashboard/WelcomeSection';
import StatsRow from '../components/dashboard/StatsRow';
import EmployabilityScore from '../components/dashboard/EmployabilityScore';
import ProgressTimeline from '../components/dashboard/ProgressTimeline';
import TopSkillsList from '../components/dashboard/TopSkillsList';
import MilestoneCard from '../components/dashboard/MilestoneCard';
import ImprovementActions from '../components/dashboard/ImprovementActions';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <WelcomeSection />
      <StatsRow />

      {/* Score + Timeline */}
      <div className="grid lg:grid-cols-[260px_1fr] gap-5">
        <EmployabilityScore />
        <ProgressTimeline />
      </div>

      {/* Skills + Milestone */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <TopSkillsList />
        <MilestoneCard />
      </div>

      <ImprovementActions />
    </div>
  );
}
