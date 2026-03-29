import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface Story {
  id: string;
  title: string;
  subject: string;
  type: "ESL" | "HSD/GED" | "CTE" | "Employer" | "Staff" | "Partner" | "Overview";
  stage: "form_sent" | "submitted" | "ai_processing" | "asset_generation" | "packaging" | "delivered";
}

interface AutomationPipelineBoardProps {
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

const stageConfig = {
  form_sent: {
    label: "Form Sent",
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
  },
  submitted: {
    label: "Submitted",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
  },
  ai_processing: {
    label: "AI Processing",
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400",
  },
  asset_generation: {
    label: "Asset Generation",
    icon: Sparkles,
    color: "text-cyan-600 dark:text-cyan-400",
  },
  packaging: {
    label: "Packaging",
    icon: Clock,
    color: "text-orange-600 dark:text-orange-400",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
  },
};

const columns: Array<keyof typeof stageConfig> = [
  "form_sent",
  "submitted",
  "ai_processing",
  "asset_generation",
  "packaging",
  "delivered",
];

export default function AutomationPipelineBoard({ stories = [] }: AutomationPipelineBoardProps) {
  const storyData: Record<string, Story[]> = {};
  
  columns.forEach((stage) => {
    storyData[stage] = stories.filter((story) => story.stage === stage);
  });

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((stage) => {
        const config = stageConfig[stage];
        const Icon = config.icon;
        
        return (
          <div key={stage} className="flex-shrink-0 w-72">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {storyData[stage]?.length || 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {storyData[stage]?.map((story) => (
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
                {(!storyData[stage] || storyData[stage].length === 0) && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No stories
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
