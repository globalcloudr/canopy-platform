import type { Project, Form, Story, Package } from "@shared/schema";
import { storage } from "./storage";

export type ProjectStatus = "planning" | "active" | "packaging" | "delivered";

export async function calculateProjectStatus(projectId: string): Promise<ProjectStatus> {
  const [forms, stories, packages, project] = await Promise.all([
    storage.getFormsByProject(projectId),
    storage.getStoriesByProject(projectId),
    storage.getPackagesByProject(projectId),
    storage.getProject(projectId),
  ]);

  if (!project) return "planning";

  if (forms.length === 0) {
    return "planning";
  }

  const completedStories = stories.filter(s => s.currentStage === "delivered");

  const targetCount = project.storyCount || 0;
  if (targetCount > 0 && completedStories.length >= targetCount) {
    if (packages.length > 0 && packages.every(pkg => pkg.status === "delivered")) {
      return "delivered";
    }
    return "packaging";
  }

  if (forms.length > 0) {
    return "active";
  }

  return "planning";
}

export async function updateProjectStatus(projectId: string): Promise<void> {
  const project = await storage.getProject(projectId);
  if (!project) return;
  
  const newStatus = await calculateProjectStatus(projectId);
  
  if (project.status !== newStatus) {
    await storage.updateProject(projectId, { status: newStatus });
  }
}
