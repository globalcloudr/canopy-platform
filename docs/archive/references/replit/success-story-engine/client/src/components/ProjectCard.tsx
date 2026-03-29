import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar, FileText, FileCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  id: string;
  clientName: string;
  name: string;
  description: string;
  storyCount: number;
  formsSubmitted: number;
  status: "planning" | "active" | "packaging" | "delivered";
  deadline: string;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  planning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  packaging: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const statusLabels = {
  planning: "Planning",
  active: "Active",
  packaging: "Packaging",
  delivered: "Delivered",
};

export default function ProjectCard({
  id,
  clientName,
  name,
  description,
  storyCount,
  formsSubmitted,
  status,
  deadline,
  onClick,
  onDelete,
}: ProjectCardProps) {
  return (
    <Card
      className="hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`project-card-${id}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1">{clientName}</p>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="mt-1.5 line-clamp-2">{description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                data-testid={`button-project-menu-${id}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); console.log("Edit", id); }}>
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); console.log("Duplicate", id); }}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (onDelete) onDelete(id);
                }}
                data-testid={`button-delete-project-${id}`}
              >
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>{storyCount} stories</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="h-4 w-4" />
              <span>{formsSubmitted} of {storyCount} submitted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{new Date(deadline).toLocaleDateString()}</span>
            </div>
          </div>
          <Badge className={statusColors[status]} variant="secondary">
            {statusLabels[status]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
