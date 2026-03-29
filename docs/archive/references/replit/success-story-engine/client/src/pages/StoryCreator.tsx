import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Eye } from "lucide-react";
import SourceForm from "@/components/SourceForm";
import ContentGenerationPanel from "@/components/ContentGenerationPanel";

// todo: remove mock functionality
const mockSuggestions = [
  {
    id: "1",
    type: "blog" as const,
    content: "Dreams on the Path to Citizenship\n\nYesenia Quintanilla's journey from El Salvador to earning her citizenship through adult education is a testament to determination and the transformative power of accessible education. After arriving in Los Angeles in 1989, she knew that education would be her key to building a better life...",
  },
  {
    id: "2",
    type: "social" as const,
    content: "🌟 Meet Yesenia! From El Salvador to U.S. citizen, she achieved her dreams through @FresnoAdultSchool. Her story shows that it's never too late to pursue your goals. #AdultEducation #SuccessStory #ESL 📚✨",
  },
  {
    id: "3",
    type: "newsletter" as const,
    content: "This Month's Featured Story: Dreams on the Path to Citizenship\n\nDear Community,\n\nWe're excited to share Yesenia Quintanilla's inspiring journey from her native El Salvador to becoming a U.S. citizen, all made possible through the dedicated programs at Fresno Adult School...",
  },
  {
    id: "4",
    type: "press-release" as const,
    content: "FOR IMMEDIATE RELEASE\n\nLocal Adult School Graduate Achieves Citizenship Dream\n\nFRESNO, CA - Yesenia Quintanilla's story exemplifies the life-changing impact of adult education programs. After enrolling at Fresno Adult School, she not only earned her high school diploma but also...",
  },
];

export default function StoryCreator() {
  const [activeTab, setActiveTab] = useState("source");
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Go back")}
            data-testid="button-back"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold">Create Success Story</h1>
            <p className="text-muted-foreground mt-1">
              Collect source information and generate multi-channel content
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          data-testid="button-toggle-preview"
        >
          <Eye className="h-4 w-4 mr-2" />
          {showPreview ? "Hide" : "Show"} Preview
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="source" data-testid="tab-source-info">
            Source Information
          </TabsTrigger>
          <TabsTrigger value="interview" data-testid="tab-interview">
            Interview Notes
          </TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content-generation">
            Content Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="source" className="space-y-6">
          <SourceForm />
        </TabsContent>

        <TabsContent value="interview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Notes</CardTitle>
              <CardDescription>
                Add notes from your interview session or paste transcripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Interview notes feature coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentGenerationPanel suggestions={mockSuggestions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
