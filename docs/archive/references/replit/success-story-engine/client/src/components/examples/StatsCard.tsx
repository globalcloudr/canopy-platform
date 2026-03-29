import StatsCard from "../StatsCard";
import { FileText, FolderOpen, Users, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Projects"
        value={12}
        icon={FolderOpen}
        trend={{ value: "+2 this month", positive: true }}
      />
      <StatsCard
        title="Stories Published"
        value={147}
        icon={FileText}
        trend={{ value: "+15 this week", positive: true }}
      />
      <StatsCard
        title="Active Sources"
        value={68}
        icon={Users}
      />
      <StatsCard
        title="Engagement Rate"
        value="94%"
        icon={TrendingUp}
        trend={{ value: "+5.2%", positive: true }}
      />
    </div>
  );
}
