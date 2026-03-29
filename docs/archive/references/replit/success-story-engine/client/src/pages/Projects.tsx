import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useLocation } from "wouter";
import ProjectCard from "@/components/ProjectCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project, Client, Form } from "@shared/schema";


export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    clientName: "",
    name: "",
    description: "",
    storyCount: "",
    deadline: "",
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const isLoading = projectsLoading;

  const createProjectMutation = useMutation({
    mutationFn: async (data: { clientName: string; name: string; description?: string; storyCount?: number; deadline?: string }) => {
      const clientRes = await apiRequest("POST", "/api/clients", {
        name: data.clientName,
        contactEmail: `contact@${data.clientName.toLowerCase().replace(/\s+/g, '')}.edu`,
      });
      const client = await clientRes.json();
      
      const projectRes = await apiRequest("POST", "/api/projects", {
        clientId: client.id,
        name: data.name,
        description: data.description || null,
        storyCount: data.storyCount || 0,
        deadline: data.deadline || null,
      });
      const project = await projectRes.json();
      
      return project;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created",
        description: `${project.name} has been created successfully.`,
      });
      setShowCreateDialog(false);
      setFormData({
        clientName: "",
        name: "",
        description: "",
        storyCount: "",
        deadline: "",
      });
      setLocation(`/projects/${project.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiRequest("DELETE", `/api/projects/${projectId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cannot delete project",
        description: error.message.includes("existing forms") 
          ? "This project has forms, stories, or packages. Please delete them first before deleting the project."
          : "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const handleCreateProject = () => {
    if (!formData.clientName.trim() || !formData.name.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in client name and project name.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate({
      clientName: formData.clientName,
      name: formData.name,
      description: formData.description,
      storyCount: formData.storyCount ? parseInt(formData.storyCount) : undefined,
      deadline: formData.deadline || undefined,
    });
  };

  // Enrich projects with client data
  const enrichedProjects = projects.map((project) => {
    const client = clients.find((c) => c.id === project.clientId);
    return {
      ...project,
      clientName: client?.name || "Unknown Client",
      // TODO: Add GET /api/projects/:id/summary endpoint that returns:
      // { projectId, submissionCount, completedStoryCount, packageCount }
      // Then fetch per-project and display real counts
      formsSubmitted: 0, // Placeholder - detailed counts visible on project detail page
    };
  });

  const filteredProjects = enrichedProjects.filter((project) => {
    const clientName = 'clientName' in project ? project.clientName : '';
    const matchesSearch =
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage client projects and track automated story production
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-project">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Set up a new success story campaign for a client. You'll configure forms and automation settings after creating the project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Institution</Label>
                <Input
                  id="clientName"
                  placeholder="e.g., Oakland Adult School"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  data-testid="input-client-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Spring 2025 Success Stories"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-project-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the campaign goals and story types"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="input-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storyCount">Number of Stories</Label>
                  <Input
                    id="storyCount"
                    type="number"
                    placeholder="12"
                    value={formData.storyCount}
                    onChange={(e) => setFormData({ ...formData, storyCount: e.target.value })}
                    data-testid="input-story-count"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    data-testid="input-deadline"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={createProjectMutation.isPending}
                data-testid="button-confirm-create"
              >
                {createProjectMutation.isPending ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client or project name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-projects"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48" data-testid="select-status-filter">
            <SelectValue>
              {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="packaging">Packaging</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const deadline = project.deadline instanceof Date ? project.deadline.toISOString() : (project.deadline || new Date().toISOString());
            return (
              <ProjectCard
                key={project.id}
                id={project.id}
                clientName={project.clientName || "Unknown Client"}
                name={project.name}
                description={project.description || ""}
                storyCount={project.storyCount || 0}
                formsSubmitted={project.formsSubmitted || 0}
                status={project.status as "planning" | "active" | "packaging" | "delivered"}
                deadline={deadline}
                onClick={() => setLocation(`/projects/${project.id}`)}
                onDelete={handleDeleteProject}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
