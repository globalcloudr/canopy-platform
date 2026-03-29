import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertClientSchema,
  insertProjectSchema,
  insertFormSchema,
  insertSubmissionSchema,
  insertStorySchema,
  insertContentSchema,
  insertAssetSchema,
  insertPackageSchema,
} from "@shared/schema";
import { processStorySubmission } from "./automation";
import { updateProjectStatus } from "./projectStatus";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Clients
  app.get("/api/clients", async (req, res) => {
    const clients = await storage.getClients();
    res.json(clients);
  });

  app.get("/api/clients/:id", async (req, res) => {
    const client = await storage.getClient(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const data = insertClientSchema.parse(req.body);
      const client = await storage.createClient(data);
      res.json(client);
    } catch (error) {
      console.error("Client creation error:", error);
      res.status(400).json({ error: "Invalid client data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/clients/:id", async (req, res) => {
    const client = await storage.updateClient(req.params.id, req.body);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    const { clientId } = req.query;
    const projects = clientId
      ? await storage.getProjectsByClient(clientId as string)
      : await storage.getProjects();
    
    await Promise.all(projects.map(p => updateProjectStatus(p.id)));
    
    const updatedProjects = clientId
      ? await storage.getProjectsByClient(clientId as string)
      : await storage.getProjects();
    res.json(updatedProjects);
  });

  app.get("/api/projects/:id", async (req, res) => {
    await updateProjectStatus(req.params.id);
    const project = await storage.getProject(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  });

  app.post("/api/projects", async (req, res) => {
    try {
      console.log("Project creation request:", req.body);
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      console.error("Project creation error:", error);
      res.status(400).json({ error: "Invalid project data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    const project = await storage.updateProject(req.params.id, req.body);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      // Check if project has any related forms, stories, or packages
      const forms = await storage.getFormsByProject(req.params.id);
      const stories = await storage.getStoriesByProject(req.params.id);
      const packages = await storage.getPackagesByProject(req.params.id);
      
      if (forms.length > 0 || stories.length > 0 || packages.length > 0) {
        return res.status(400).json({ 
          error: "Cannot delete project with existing forms, stories, or packages",
          details: {
            forms: forms.length,
            stories: stories.length,
            packages: packages.length
          }
        });
      }
      
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Project not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ 
        error: "Failed to delete project",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Forms
  app.get("/api/forms", async (req, res) => {
    const { projectId } = req.query;
    // Allow fetching all forms or by project
    const forms = projectId
      ? await storage.getFormsByProject(projectId as string)
      : [];
    res.json(forms);
  });

  app.get("/api/forms/:id", async (req, res) => {
    const form = await storage.getForm(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  });

  app.post("/api/forms", async (req, res) => {
    try {
      const data = insertFormSchema.parse(req.body);
      const form = await storage.createForm(data);
      await updateProjectStatus(form.projectId);
      res.json(form);
    } catch (error) {
      res.status(400).json({ error: "Invalid form data" });
    }
  });

  app.patch("/api/forms/:id", async (req, res) => {
    const form = await storage.updateForm(req.params.id, req.body);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  });

  app.delete("/api/forms/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteForm(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Form not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Delete form error:", error);
      res.status(500).json({ 
        error: "Failed to delete form",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Submissions
  app.get("/api/submissions", async (req, res) => {
    const { projectId, formId } = req.query;
    if (formId) {
      const submissions = await storage.getSubmissionsByForm(formId as string);
      return res.json(submissions);
    }
    if (projectId) {
      const submissions = await storage.getSubmissionsByProject(projectId as string);
      return res.json(submissions);
    }
    res.status(400).json({ error: "projectId or formId required" });
  });

  app.get("/api/submissions/:id", async (req, res) => {
    const submission = await storage.getSubmission(req.params.id);
    if (!submission) return res.status(404).json({ error: "Submission not found" });
    res.json(submission);
  });

  app.post("/api/submissions", async (req, res) => {
    try {
      const data = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(data);
      
      // Create story from submission, including photoUrls in sourceData
      const story = await storage.createStory({
        projectId: submission.projectId,
        submissionId: submission.id,
        title: `Story for ${submission.submitterName || "Unknown"}`,
        storyType: req.body.storyType || "Overview",
        subjectName: submission.submitterName,
        status: "processing",
        currentStage: "content_generation",
        sourceData: {
          ...submission.data,
          photoUrls: submission.photoUrls || undefined,
        } as Record<string, any>,
      });

      // Trigger automation pipeline asynchronously (don't wait)
      processStorySubmission(storage, story.id).catch((error) => {
        console.error(`[Routes] Automation failed for story ${story.id}:`, error);
      });

      res.json({ submission, story });
    } catch (error) {
      res.status(400).json({ error: "Invalid submission data" });
    }
  });

  // Stories
  app.get("/api/stories", async (req, res) => {
    const { projectId } = req.query;
    const stories = projectId
      ? await storage.getStoriesByProject(projectId as string)
      : await storage.getStories();
    res.json(stories);
  });

  app.get("/api/stories/:id", async (req, res) => {
    const story = await storage.getStory(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });
    res.json(story);
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const data = insertStorySchema.parse(req.body);
      const story = await storage.createStory(data);
      await updateProjectStatus(story.projectId);
      res.json(story);
    } catch (error) {
      res.status(400).json({ error: "Invalid story data" });
    }
  });

  app.patch("/api/stories/:id", async (req, res) => {
    const story = await storage.updateStory(req.params.id, req.body);
    if (!story) return res.status(404).json({ error: "Story not found" });
    await updateProjectStatus(story.projectId);
    res.json(story);
  });

  app.delete("/api/stories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStory(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Story not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Delete story error:", error);
      res.status(500).json({ 
        error: "Failed to delete story",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Content
  app.get("/api/content", async (req, res) => {
    const { storyId } = req.query;
    if (!storyId) return res.status(400).json({ error: "storyId required" });
    const content = await storage.getContentByStory(storyId as string);
    res.json(content);
  });

  app.get("/api/content/:id", async (req, res) => {
    const content = await storage.getContent(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });
    res.json(content);
  });

  app.post("/api/content", async (req, res) => {
    try {
      const data = insertContentSchema.parse(req.body);
      const content = await storage.createContent(data);
      res.json(content);
    } catch (error) {
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  // Assets
  app.get("/api/assets", async (req, res) => {
    const { storyId } = req.query;
    if (!storyId) return res.status(400).json({ error: "storyId required" });
    const assets = await storage.getAssetsByStory(storyId as string);
    res.json(assets);
  });

  app.get("/api/assets/:id", async (req, res) => {
    const asset = await storage.getAsset(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json(asset);
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const data = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(data);
      res.json(asset);
    } catch (error) {
      res.status(400).json({ error: "Invalid asset data" });
    }
  });

  // Packages
  app.get("/api/packages/:id", async (req, res) => {
    const pkg = await storage.getPackage(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  });

  app.get("/api/packages", async (req, res) => {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ error: "projectId required" });
    const packages = await storage.getPackagesByProject(projectId as string);
    res.json(packages);
  });

  app.post("/api/packages", async (req, res) => {
    try {
      const data = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage(data);
      await updateProjectStatus(pkg.projectId);
      res.json(pkg);
    } catch (error) {
      res.status(400).json({ error: "Invalid package data" });
    }
  });

  app.patch("/api/packages/:id", async (req, res) => {
    const pkg = await storage.updatePackage(req.params.id, req.body);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    await updateProjectStatus(pkg.projectId);
    res.json(pkg);
  });

  app.delete("/api/packages/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePackage(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Package not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Delete package error:", error);
      res.status(500).json({ 
        error: "Failed to delete package",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Object Storage - Public file uploading (no auth needed for form submissions)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put("/api/photos", async (req, res) => {
    if (!req.body.photoURL) {
      return res.status(400).json({ error: "photoURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(
        req.body.photoURL,
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting photo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
