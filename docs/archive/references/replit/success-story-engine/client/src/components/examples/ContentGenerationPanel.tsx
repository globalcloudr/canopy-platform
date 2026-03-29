import ContentGenerationPanel from "../ContentGenerationPanel";

const mockSuggestions = [
  {
    id: "1",
    type: "blog" as const,
    content: "Dreams on the Path to Citizenship\n\nYesenia Quintanilla's journey from El Salvador to earning her citizenship through adult education is a testament to determination and the transformative power of accessible education...",
  },
  {
    id: "2",
    type: "social" as const,
    content: "🌟 Meet Yesenia! From El Salvador to U.S. citizen, she achieved her dreams through @FresnoAdultSchool. Her story shows that it's never too late to pursue your goals. #AdultEducation #SuccessStory #ESL",
  },
  {
    id: "3",
    type: "newsletter" as const,
    content: "This Month's Featured Story: Dreams on the Path to Citizenship\n\nDear Community,\n\nWe're excited to share Yesenia Quintanilla's inspiring journey...",
  },
];

export default function ContentGenerationPanelExample() {
  return <ContentGenerationPanel suggestions={mockSuggestions} />;
}
