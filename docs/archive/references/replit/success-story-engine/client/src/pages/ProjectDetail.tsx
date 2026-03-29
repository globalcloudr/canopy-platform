import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Send,
  Download,
  Settings as SettingsIcon,
  Sparkles,
  Image as ImageIcon,
  Package as PackageIcon,
  Copy,
  Trash2,
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import AutomationPipelineBoard from "@/components/AutomationPipelineBoard";
import FormBuilderDialog from "@/components/FormBuilderDialog";
import type { Project, Form, Story, Package } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const mockProject = {
  id: "1",
  clientName: "Ventura County Adult Ed Consortium",
  name: "Fall 2024 Success Stories",
  description: "12 stories across ESL, HSD/GED, and CTE programs",
  storyCount: 12,
  formsSubmitted: 12,
  status: "packaging" as const,
  deadline: "2024-12-15",
  contactEmail: "director@ventura-adult-ed.org",
  contactName: "Jane Smith",
};

const mockStories = [
  { id: "1", title: "Dreams on the Path to Citizenship", subject: "Yesenia Quintanilla", type: "ESL" as const, stage: "ai_processing" as const },
  { id: "2", title: "The Future Is Hers", subject: "Angela Byrd", type: "HSD/GED" as const, stage: "asset_generation" as const },
  { id: "3", title: "Third Time's the Charm", subject: "Medical Assistant Student", type: "CTE" as const, stage: "submitted" as const },
  { id: "4", title: "A Well-Oiled Machine", subject: "Gabriela Pingarron", type: "Employer" as const, stage: "packaging" as const },
];

const mockForms = [
  {
    id: "1",
    title: "ESL Student Success Form",
    storyType: "ESL",
    submissionCount: 4,
    totalNeeded: 4,
    lastSubmitted: "2024-10-20",
    shareableLink: "https://forms.akkedi.digital/f/abc123",
  },
  {
    id: "2",
    title: "HSD/GED Graduate Form",
    storyType: "HSD/GED",
    submissionCount: 3,
    totalNeeded: 3,
    lastSubmitted: "2024-10-18",
    shareableLink: "https://forms.akkedi.digital/f/def456",
  },
  {
    id: "3",
    title: "CTE Program Success Form",
    storyType: "CTE",
    submissionCount: 3,
    totalNeeded: 3,
    lastSubmitted: "2024-10-15",
    shareableLink: "https://forms.akkedi.digital/f/ghi789",
  },
  {
    id: "4",
    title: "Employer Partnership Form",
    storyType: "Employer",
    submissionCount: 2,
    totalNeeded: 2,
    lastSubmitted: "2024-10-10",
    shareableLink: "https://forms.akkedi.digital/f/jkl012",
  },
];

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

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id;
  const { toast } = useToast();
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  const { data: forms = [], isLoading: formsLoading } = useQuery<Form[]>({
    queryKey: [`/api/forms?projectId=${projectId}`],
    enabled: !!projectId,
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: [`/api/stories?projectId=${projectId}`],
    enabled: !!projectId,
    refetchInterval: 5000, // Refresh every 5 seconds to catch new stories from automation
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery<Package[]>({
    queryKey: [`/api/packages?projectId=${projectId}`],
    enabled: !!projectId,
    refetchInterval: 5000, // Refresh every 5 seconds to catch new packages from automation
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Link copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard. Please copy the link manually.",
        variant: "destructive",
      });
    });
  };

  const sendFormEmail = (formTitle: string, shareableLink: string) => {
    const subject = encodeURIComponent(`Complete Your Success Story: ${formTitle}`);
    const body = encodeURIComponent(
      `Hello,\n\nPlease complete your success story using the form below:\n\n${shareableLink}\n\nThis form should take about 10-15 minutes to complete. Your story will help us showcase the impact of our programs.\n\nThank you for your participation!\n\nBest regards,\nAkkedis Digital`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const deleteFormMutation = useMutation({
    mutationFn: async (formId: string) => {
      const response = await apiRequest("DELETE", `/api/forms/${formId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete form");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate forms, stories, and packages as they may have been cascade deleted
      queryClient.invalidateQueries({ queryKey: [`/api/forms?projectId=${projectId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/stories?projectId=${projectId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
      queryClient.invalidateQueries({ queryKey: [`/api/packages?projectId=${projectId}`] });
      toast({
        title: "Form deleted",
        description: "The form and all related stories have been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteForm = (formId: string, formTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${formTitle}"? This action cannot be undone.`)) {
      deleteFormMutation.mutate(formId);
    }
  };

  const deletePackageMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const response = await apiRequest("DELETE", `/api/packages/${packageId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete package");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/packages?projectId=${projectId}`] });
      toast({
        title: "Package deleted",
        description: "The package has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete package. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeletePackage = (packageId: string, packageName: string) => {
    if (window.confirm(`Are you sure you want to delete package "${packageName}"? This action cannot be undone.`)) {
      deletePackageMutation.mutate(packageId);
    }
  };

  if (projectLoading) {
    return <ProjectSkeleton />;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const displayProject = project || mockProject;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="mb-2" data-testid="button-back-to-projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-semibold">{displayProject.name}</h1>
            <Badge className={statusColors[displayProject.status as keyof typeof statusColors] || statusColors.planning} variant="secondary">
              {statusLabels[displayProject.status as keyof typeof statusLabels] || "Unknown"}
            </Badge>
          </div>
        </div>
        <Button variant="outline" data-testid="button-project-settings">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Project Settings
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Story Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{displayProject.storyCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Target stories for this project</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forms Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{forms.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to send to clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stories Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stories.length > 0 ? `${Math.round((stories.length / (displayProject.storyCount || 1)) * 100)}% of goal` : "Get started below"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deadline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {displayProject.deadline ? new Date(displayProject.deadline).toLocaleDateString() : "Not set"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {displayProject.deadline && new Date(displayProject.deadline) > new Date() 
                ? `${Math.ceil((new Date(displayProject.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                : displayProject.deadline ? "Overdue" : "No deadline set"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">
            Overview
          </TabsTrigger>
          <TabsTrigger value="forms" data-testid="tab-forms">
            <FileText className="h-4 w-4 mr-2" />
            Forms
          </TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">
            <Sparkles className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="assets" data-testid="tab-assets">
            <ImageIcon className="h-4 w-4 mr-2" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="package" data-testid="tab-package">
            <PackageIcon className="h-4 w-4 mr-2" />
            Package
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Story Pipeline</h2>
            {storiesLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ) : stories.length > 0 ? (
              <AutomationPipelineBoard stories={stories.map(s => ({
                id: s.id,
                title: s.title,
                subject: s.subjectName || "Unknown",
                type: s.storyType as any,
                stage: s.currentStage as any,
              }))} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No stories yet. Create forms and start collecting submissions.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{displayProject.description || "No description provided"}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Form Templates</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and track client form submissions
              </p>
            </div>
            <Button onClick={() => setFormDialogOpen(true)} data-testid="button-create-form">
              <FileText className="h-4 w-4 mr-2" />
              Create Form
            </Button>
          </div>

          {formsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : forms.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No forms created yet</p>
                  <Button onClick={() => setFormDialogOpen(true)} variant="outline">
                    Create Your First Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {forms.map((form) => (
                <Card key={form.id} className="hover-elevate">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{form.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {form.storyType}
                          </Badge>
                        </div>
                        {form.description && (
                          <p className="text-sm text-muted-foreground">{form.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground font-mono">
                          {form.shareableLink || `https://forms.akkedi.digital/f/${form.id}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(form.shareableLink || `https://forms.akkedi.digital/f/${form.id}`)}
                          data-testid={`button-copy-link-${form.id}`}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => sendFormEmail(form.title, form.shareableLink || `${window.location.origin}/form/${form.id}`)}
                          data-testid={`button-resend-${form.id}`}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteForm(form.id, form.title)}
                          data-testid={`button-delete-form-${form.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <FormBuilderDialog
            open={formDialogOpen}
            onOpenChange={setFormDialogOpen}
            projectId={projectId || ""}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">AI-Generated Content</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review automated content generation for all stories
            </p>
          </div>
          
          {stories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No stories with content yet</p>
                  <p className="text-xs text-muted-foreground mt-2">Submit forms to start content generation</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <Card key={story.id} className="hover-elevate cursor-pointer" onClick={() => window.location.href = `/stories/${story.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{story.subjectName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {story.storyType}
                          </Badge>
                          <Badge variant={story.currentStage === 'delivered' ? 'default' : 'secondary'} className="text-xs">
                            {story.currentStage === 'ai_processing' ? 'Generating...' : 
                             story.currentStage === 'packaging' ? 'Packaging...' : 
                             story.currentStage === 'delivered' ? 'Ready' : story.currentStage}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{story.title}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📝 Blog Post</span>
                          <span>📱 4 Social Posts</span>
                          <span>📧 Newsletter</span>
                          <span>📰 Press Release</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); window.location.href = `/stories/${story.id}`; }}>
                        View Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Generated Assets</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Graphics, videos, and visual materials for all stories
            </p>
          </div>
          
          {stories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No stories with assets yet</p>
                  <p className="text-xs text-muted-foreground mt-2">Submit forms to start asset generation</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <Card key={story.id} className="hover-elevate cursor-pointer" onClick={() => window.location.href = `/stories/${story.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{story.subjectName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {story.storyType}
                          </Badge>
                          <Badge variant={story.currentStage === 'delivered' ? 'default' : 'secondary'} className="text-xs">
                            {story.currentStage === 'asset_generation' ? 'Generating...' : 
                             story.currentStage === 'packaging' ? 'Packaging...' : 
                             story.currentStage === 'delivered' ? 'Ready' : story.currentStage}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{story.title}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>🎬 15-second Video</span>
                          <span>📸 Social Graphics</span>
                          <span>💬 Quote Cards</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); window.location.href = `/stories/${story.id}`; }}>
                        View Assets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="package" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Deliverable Packages</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete multi-channel content packages ready for client
              </p>
            </div>
          </div>

          {packagesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <PackageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No packages created yet</p>
                  <p className="text-xs text-muted-foreground">Packages are automatically created when stories are delivered</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="hover-elevate">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{pkg.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {pkg.status}
                          </Badge>
                        </div>
                        {pkg.description && (
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>
                        )}
                        {pkg.shareableLink && (
                          <p className="text-xs text-muted-foreground font-mono">{pkg.shareableLink}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {pkg.shareableLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(pkg.shareableLink!)}
                            data-testid={`button-copy-package-link-${pkg.id}`}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                          data-testid={`button-delete-package-${pkg.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
