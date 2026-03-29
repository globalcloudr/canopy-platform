import StoryPipelineBoard from "../StoryPipelineBoard";

const mockStories = [
  { id: "1", title: "Dreams on the Path to Citizenship", subject: "Yesenia Quintanilla", type: "ESL" as const },
  { id: "2", title: "The Future Is Hers", subject: "Angela Byrd", type: "HSD/GED" as const },
  { id: "3", title: "Third Time's the Charm", subject: "Medical Assistant Student", type: "CTE" as const },
  { id: "4", title: "A Well-Oiled Machine", subject: "Gabriela Pingarron", type: "Employer" as const },
  { id: "5", title: "Confident Communication", subject: "Nidia Roth", type: "ESL" as const },
  { id: "6", title: "An Educational Mission", subject: "Schel Brown", type: "Staff" as const },
  { id: "7", title: "Learning on Wheels", subject: "Don Curtis", type: "Staff" as const },
  { id: "8", title: "Better Together", subject: "Workforce Development Board", type: "Partner" as const },
  { id: "9", title: "For a Healthier Future", subject: "Sean Abajian", type: "Employer" as const },
  { id: "10", title: "Ventura County Adult Education: Overview", subject: "Carolyn Vang-Walker", type: "Overview" as const },
];

export default function StoryPipelineBoardExample() {
  return <StoryPipelineBoard stories={mockStories} />;
}
