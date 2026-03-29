import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Grid3x3, List } from "lucide-react";
import StoryCard from "@/components/StoryCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Story, Content, Submission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Stories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ['/api/stories'],
  });

  const { data: contents = [] } = useQuery<Content[]>({
    queryKey: ['/api/content'],
  });

  const deleteStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const response = await apiRequest("DELETE", `/api/stories/${storyId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete story");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({
        title: "Story deleted",
        description: "The story has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    if (window.confirm(`Are you sure you want to delete "${story.title}"? This action cannot be undone.`)) {
      deleteStoryMutation.mutate(storyId);
    }
  };

  const filteredStories = stories.filter((story) => {
    const matchesSearch = 
      story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.subjectName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || story.storyType.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const getStoryExcerpt = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    const blogContent = contents.find(c => c.storyId === storyId && c.contentType === 'blog');
    
    if (blogContent?.body) {
      return blogContent.body.substring(0, 200) + '...';
    }
    
    // Show appropriate message based on story status
    if (story?.currentStage === "delivered" || story?.status === "completed") {
      return "Story complete - All content and assets generated";
    }
    
    return "Content is being generated...";
  };

  const getStoryStatus = (stage: string) => {
    if (stage === "delivered") return "published" as const;
    return "draft" as const;
  };

  const getStoryPhoto = (story: Story): string | undefined => {
    if (story.sourceData && typeof story.sourceData === 'object') {
      const photoUrls = (story.sourceData as any).photoUrls;
      if (Array.isArray(photoUrls) && photoUrls.length > 0) {
        return photoUrls[0];
      }
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Stories</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your success story library
          </p>
        </div>
        <Button data-testid="button-create-story" onClick={() => setLocation("/stories/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Story
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-stories"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48" data-testid="select-type-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="esl">ESL</SelectItem>
            <SelectItem value="hsd-ged">HSD/GED</SelectItem>
            <SelectItem value="cte">CTE</SelectItem>
            <SelectItem value="employer">Employer</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
            data-testid="button-view-grid"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
            data-testid="button-view-list"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : filteredStories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== "all" 
                ? "No stories found matching your filters" 
                : "No stories yet. Stories are created automatically when forms are submitted."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title || "Untitled Story"}
              excerpt={getStoryExcerpt(story.id)}
              onDelete={handleDeleteStory}
              subject={story.subjectName || "N/A"}
              type={story.storyType}
              date={new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              status={getStoryStatus(story.currentStage)}
              imageUrl={getStoryPhoto(story)}
              onClick={() => setLocation(`/stories/${story.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
