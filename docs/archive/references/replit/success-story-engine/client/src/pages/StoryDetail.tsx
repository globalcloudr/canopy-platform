import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Download, Package, Video, Image as ImageIcon, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Story, Content, Asset } from "@shared/schema";

export default function StoryDetail() {
  const { id } = useParams();
  
  const { data: story, isLoading: storyLoading } = useQuery<Story>({
    queryKey: ['/api/stories', id],
  });

  const { data: storyContents = [], isLoading: contentsLoading } = useQuery<Content[]>({
    queryKey: ['/api/content', { storyId: id }],
    queryFn: async () => {
      const response = await fetch(`/api/content?storyId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    },
    enabled: !!story && !!id,
  });

  const { data: assets = [], isLoading: assetsLoading } = useQuery<Asset[]>({
    queryKey: ['/api/assets', { storyId: id }],
    queryFn: async () => {
      const response = await fetch(`/api/assets?storyId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch assets');
      return response.json();
    },
    enabled: !!story && !!id,
  });

  const { data: packages = [] } = useQuery<any[]>({
    queryKey: ['/api/packages', { projectId: story?.projectId }],
    queryFn: async () => {
      if (!story?.projectId) return [];
      const response = await fetch(`/api/packages?projectId=${story.projectId}`);
      if (!response.ok) throw new Error('Failed to fetch packages');
      return response.json();
    },
    enabled: !!story && !!story.projectId,
  });

  const storyPackage = packages.find(p => p.storyId === id);
  const videoAssets = assets.filter(a => a.assetType === 'video');
  const imageAssets = assets.filter(a => a.assetType === 'image');

  if (storyLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/stories">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Stories
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Story not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "packaging": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "asset_generation": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "ai_processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "submitted": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      case "form_sent": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "form_sent": return "Form Sent";
      case "submitted": return "Submitted";
      case "ai_processing": return "AI Processing";
      case "asset_generation": return "Generating Assets";
      case "packaging": return "Packaging";
      case "delivered": return "Delivered";
      default: return stage;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/stories">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Stories
            </Button>
          </Link>
        </div>
        {storyPackage && (
          <Link href={`/package/${storyPackage.id}`}>
            <Button data-testid="button-view-package">
              <Package className="h-4 w-4 mr-2" />
              View Package
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold" data-testid="text-story-title">
            {story.title || "Untitled Story"}
          </h1>
          <Badge className={getStatusColor(story.currentStage)} data-testid="badge-status">
            {getStageLabel(story.currentStage)}
          </Badge>
        </div>
        <p className="text-muted-foreground" data-testid="text-story-type">
          {story.storyType}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-medium">Subject Name</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold" data-testid="text-subject-name">
              {story.subjectName || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-medium">Created Date</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold" data-testid="text-created-date">
              {new Date(story.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-medium">Content Pieces</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold" data-testid="text-content-count">
              {storyContents.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {contentsLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : storyContents.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generated Content</h2>
          <div className="grid gap-4">
            {storyContents.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold capitalize" data-testid={`text-content-${content.contentType}`}>
                      {content.contentType.replace('_', ' ')}
                    </h3>
                    <Badge variant="outline">{content.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.title && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
                      <p className="mt-1">{content.title}</p>
                    </div>
                  )}
                  {content.body && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Content</h4>
                      <div className="mt-1 prose prose-sm max-w-none dark:prose-invert line-clamp-6 overflow-hidden">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content.body}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([content.body || ''], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${content.contentType}-${story.subjectName || 'story'}.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      data-testid={`button-download-${content.contentType}`}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No content generated yet</p>
          </CardContent>
        </Card>
      )}

      {assets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generated Assets</h2>
          
          {videoAssets.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Videos</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {videoAssets.map((video) => {
                  const isAvailable = video.status === 'ready' && !video.fileUrl.startsWith('[');
                  return (
                    <div key={video.id} className="flex items-center justify-between p-3 border rounded-md" data-testid={`asset-video-${video.id}`}>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{video.fileName}</p>
                        <p className="text-xs text-muted-foreground">{video.dimensions} • {video.platform}</p>
                        {!isAvailable && (
                          <p className="text-xs text-muted-foreground mt-1 italic">Video generation in progress</p>
                        )}
                      </div>
                      {isAvailable ? (
                        <Button size="sm" variant="outline" asChild>
                          <a href={video.fileUrl} target="_blank" rel="noopener noreferrer" data-testid={`button-view-video-${video.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Video
                          </a>
                        </Button>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {imageAssets.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Images</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {imageAssets.map((image) => {
                  const isAvailable = image.status === 'ready' && !image.fileUrl.startsWith('[');
                  return (
                    <div key={image.id} className="flex items-center justify-between p-3 border rounded-md" data-testid={`asset-image-${image.id}`}>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{image.fileName}</p>
                        <p className="text-xs text-muted-foreground">{image.dimensions} • {image.platform}</p>
                        {!isAvailable && (
                          <p className="text-xs text-muted-foreground mt-1 italic">Thumbnail generation in progress</p>
                        )}
                      </div>
                      {isAvailable ? (
                        <Button size="sm" variant="outline" asChild>
                          <a href={image.fileUrl} target="_blank" rel="noopener noreferrer" data-testid={`button-view-image-${image.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Image
                          </a>
                        </Button>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
