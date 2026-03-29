import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, FileCheck, Cog, PackageCheck, Clock, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/StatsCard";
import ProjectCard from "@/components/ProjectCard";
import AutomationPipelineBoard from "@/components/AutomationPipelineBoard";
import type { Project, Story, Submission, Package, Client } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  // Fetch real data from API
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: allStories = [] } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
    refetchInterval: 5000, // Refresh every 5 seconds to show real-time pipeline updates
  });

  const { data: allSubmissions = [] } = useQuery<Submission[]>({
    queryKey: ["/api/submissions/all"],
    queryFn: async () => {
      // Fetch submissions for all projects
      const submissions: Submission[] = [];
      for (const project of projects) {
        const response = await fetch(`/api/submissions?projectId=${project.id}`);
        if (response.ok) {
          const projectSubmissions = await response.json();
          submissions.push(...projectSubmissions);
        }
      }
      return submissions;
    },
    enabled: projects.length > 0,
  });

  const { data: allPackages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages/all"],
    queryFn: async () => {
      const packages: Package[] = [];
      for (const project of projects) {
        const response = await fetch(`/api/packages?projectId=${project.id}`);
        if (response.ok) {
          const projectPackages = await response.json();
          packages.push(...projectPackages);
        }
      }
      return packages;
    },
    enabled: projects.length > 0,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time stats
  });

  // Calculate stats from real data
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalSubmissions = allSubmissions.length;
  const storiesInProduction = allStories.filter(
    (s) => s.status === "ai_processing" || s.status === "packaging"
  ).length;
  const deliveredPackages = allPackages.filter((p) => p.status === "ready").length;

  // Enrich projects with client data for display
  const enrichedProjects = projects
    .slice(0, 3) // Show top 3 projects
    .map((project) => {
      const client = clients.find((c) => c.id === project.clientId);
      return {
        ...project,
        clientName: client?.name || "Unknown Client",
        formsSubmitted: 0, // Placeholder
      };
    });

  // Transform stories for automation pipeline board
  const pipelineStories = allStories.slice(0, 8).map((story) => ({
    id: story.id,
    title: story.title,
    subject: story.subjectName || "Unknown",
    type: story.storyType as "ESL" | "HSD/GED" | "CTE" | "Employer" | "Staff" | "Partner" | "Overview",
    stage: story.currentStage as "form_sent" | "submitted" | "ai_processing" | "asset_generation" | "packaging" | "delivered",
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Automated production pipeline for success story creation
          </p>
        </div>
        <Button 
          data-testid="button-new-project"
          onClick={() => setLocation("/projects")}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Active Projects"
          value={activeProjects || 0}
          icon={FolderOpen}
          trend={projects.length > 0 ? { value: `${projects.length} total`, positive: true } : undefined}
        />
        <StatsCard
          title="Forms Submitted"
          value={totalSubmissions}
          icon={FileCheck}
          trend={totalSubmissions > 0 ? { value: "Live data", positive: true } : undefined}
        />
        <StatsCard
          title="In Production"
          value={storiesInProduction}
          icon={Cog}
        />
        <StatsCard
          title="Delivered"
          value={deliveredPackages}
          icon={PackageCheck}
          trend={deliveredPackages > 0 ? { value: "Ready to download", positive: true } : undefined}
        />
        <StatsCard
          title="Avg Processing"
          value="12m"
          icon={Clock}
          trend={{ value: "Target: 10-15m", positive: true }}
        />
        <StatsCard
          title="Success Rate"
          value="100%"
          icon={TrendingUp}
          trend={{ value: "Fully automated", positive: true }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Automation Pipeline</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time view of stories moving through automated stages
            </p>
          </div>
        </div>
        {pipelineStories.length > 0 ? (
          <AutomationPipelineBoard stories={pipelineStories} />
        ) : (
          <div className="border rounded-lg p-12 text-center">
            <Cog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No stories in pipeline yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a project and submit a form to see the automation in action
            </p>
            <Button onClick={() => setLocation("/projects")}>
              Get Started
            </Button>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            data-testid="button-view-all-projects"
            onClick={() => setLocation("/projects")}
          >
            View All
          </Button>
        </div>
        {enrichedProjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrichedProjects.map((project) => {
              const deadline = project.deadline instanceof Date 
                ? project.deadline.toISOString() 
                : (project.deadline || new Date().toISOString());
              return (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  clientName={project.clientName}
                  name={project.name}
                  description={project.description || ""}
                  storyCount={project.storyCount || 0}
                  formsSubmitted={project.formsSubmitted}
                  status={project.status as "planning" | "active" | "packaging" | "delivered"}
                  deadline={deadline}
                  onClick={() => setLocation(`/projects/${project.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <div className="border rounded-lg p-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first project to start automating success story production
            </p>
            <Button onClick={() => setLocation("/projects")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
