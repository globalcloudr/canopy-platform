import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Story {
  id: string;
  title: string;
  subject: string;
  type: "ESL" | "HSD/GED" | "CTE" | "Employer" | "Staff" | "Partner" | "Overview";
}

interface StoryPipelineBoardProps {
  stories?: Story[];
}

const typeColors = {
  ESL: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "HSD/GED": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CTE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Employer: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Staff: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  Partner: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  Overview: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const columns = ["Planning", "In Interview", "Writing", "Review", "Published"];

export default function StoryPipelineBoard({ stories }: StoryPipelineBoardProps) {
  const [storyData] = useState<Record<string, Story[]>>({
    Planning: stories?.slice(0, 2) || [],
    "In Interview": stories?.slice(2, 4) || [],
    Writing: stories?.slice(4, 6) || [],
    Review: stories?.slice(6, 8) || [],
    Published: stories?.slice(8) || [],
  });

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column} className="flex-shrink-0 w-72">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{column}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {storyData[column]?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {storyData[column]?.map((story) => (
                <Card
                  key={story.id}
                  className="p-4 hover-elevate cursor-pointer"
                  onClick={() => console.log("Story clicked:", story.id)}
                  data-testid={`story-card-${story.id}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm line-clamp-2">{story.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{story.subject}</p>
                    <Badge className={`${typeColors[story.type]} text-xs`} variant="secondary">
                      {story.type}
                    </Badge>
                  </div>
                </Card>
              ))}
              {(!storyData[column] || storyData[column].length === 0) && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No stories yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
