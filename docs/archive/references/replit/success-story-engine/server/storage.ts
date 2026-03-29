import {
  type User,
  type InsertUser,
  type Client,
  type InsertClient,
  type Project,
  type InsertProject,
  type Form,
  type InsertForm,
  type Submission,
  type InsertSubmission,
  type Story,
  type InsertStory,
  type Content,
  type InsertContent,
  type Asset,
  type InsertAsset,
  type Package,
  type InsertPackage,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Get the base URL for shareable links
function getBaseUrl(): string {
  // In production, use custom domain if available
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // In development, use Replit domain
  const replitDomain = process.env.REPLIT_DOMAINS;
  if (replitDomain) {
    return `https://${replitDomain}`;
  }
  
  // Fallback
  return "http://localhost:5000";
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Clients
  getClient(id: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;

  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByClient(clientId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Forms
  getForm(id: string): Promise<Form | undefined>;
  getFormsByProject(projectId: string): Promise<Form[]>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: string, form: Partial<InsertForm>): Promise<Form | undefined>;
  deleteForm(id: string): Promise<boolean>;

  // Submissions
  getSubmission(id: string): Promise<Submission | undefined>;
  getSubmissionsByProject(projectId: string): Promise<Submission[]>;
  getSubmissionsByForm(formId: string): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;

  // Stories
  getStory(id: string): Promise<Story | undefined>;
  getStories(): Promise<Story[]>;
  getStoriesByProject(projectId: string): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: string, story: Partial<InsertStory>): Promise<Story | undefined>;
  deleteStory(id: string): Promise<boolean>;

  // Content
  getContent(id: string): Promise<Content | undefined>;
  getContentByStory(storyId: string): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;

  // Assets
  getAsset(id: string): Promise<Asset | undefined>;
  getAssetsByStory(storyId: string): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;

  // Packages
  getPackage(id: string): Promise<Package | undefined>;
  getPackagesByProject(projectId: string): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private projects: Map<string, Project>;
  private forms: Map<string, Form>;
  private submissions: Map<string, Submission>;
  private stories: Map<string, Story>;
  private content: Map<string, Content>;
  private assets: Map<string, Asset>;
  private packages: Map<string, Package>;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.projects = new Map();
    this.forms = new Map();
    this.submissions = new Map();
    this.stories = new Map();
    this.content = new Map();
    this.assets = new Map();
    this.packages = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      id,
      name: insertClient.name,
      contactEmail: insertClient.contactEmail,
      contactName: insertClient.contactName ?? null,
      contactPhone: insertClient.contactPhone ?? null,
      institutionType: insertClient.institutionType ?? null,
      logoUrl: insertClient.logoUrl ?? null,
      brandColors: (insertClient.brandColors ?? null) as { primary?: string; secondary?: string } | null,
      notes: insertClient.notes ?? null,
      createdAt: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    const updated = { ...client, ...updates } as Client;
    this.clients.set(id, updated);
    return updated;
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter((p) => p.clientId === clientId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      id,
      clientId: insertProject.clientId,
      name: insertProject.name,
      description: insertProject.description ?? null,
      status: insertProject.status ?? "planning",
      storyCount: insertProject.storyCount ?? null,
      deadline: insertProject.deadline ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updated = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Forms
  async getForm(id: string): Promise<Form | undefined> {
    return this.forms.get(id);
  }

  async getFormsByProject(projectId: string): Promise<Form[]> {
    return Array.from(this.forms.values()).filter((f) => f.projectId === projectId);
  }

  async createForm(insertForm: InsertForm): Promise<Form> {
    const id = randomUUID();
    const shareableLink = `${getBaseUrl()}/form/${id}`;
    const form: Form = {
      id,
      projectId: insertForm.projectId,
      title: insertForm.title,
      description: insertForm.description ?? null,
      storyType: insertForm.storyType,
      fields: insertForm.fields as Array<{
        id: string;
        type: string;
        label: string;
        placeholder?: string;
        required: boolean;
        options?: string[];
      }>,
      shareableLink,
      isActive: insertForm.isActive ?? true,
      createdAt: new Date(),
    };
    this.forms.set(id, form);
    return form;
  }

  async updateForm(id: string, updates: Partial<InsertForm>): Promise<Form | undefined> {
    const form = this.forms.get(id);
    if (!form) return undefined;
    const updated = { ...form, ...updates } as Form;
    this.forms.set(id, updated);
    return updated;
  }

  async deleteForm(id: string): Promise<boolean> {
    return this.forms.delete(id);
  }

  // Submissions
  async getSubmission(id: string): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionsByProject(projectId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter((s) => s.projectId === projectId);
  }

  async getSubmissionsByForm(formId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter((s) => s.formId === formId);
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      id,
      formId: insertSubmission.formId,
      projectId: insertSubmission.projectId,
      submitterName: insertSubmission.submitterName ?? null,
      submitterEmail: insertSubmission.submitterEmail ?? null,
      data: insertSubmission.data,
      status: "submitted",
      submittedAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  // Stories
  async getStory(id: string): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStories(): Promise<Story[]> {
    return Array.from(this.stories.values());
  }

  async getStoriesByProject(projectId: string): Promise<Story[]> {
    return Array.from(this.stories.values()).filter((s) => s.projectId === projectId);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = randomUUID();
    const story: Story = {
      id,
      projectId: insertStory.projectId,
      submissionId: insertStory.submissionId ?? null,
      title: insertStory.title,
      storyType: insertStory.storyType,
      subjectName: insertStory.subjectName ?? null,
      status: insertStory.status ?? "form_sent",
      currentStage: insertStory.currentStage ?? "form_sent",
      sourceData: insertStory.sourceData ?? null,
      errorMessage: insertStory.errorMessage ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStory(id: string, updates: Partial<InsertStory>): Promise<Story | undefined> {
    const story = this.stories.get(id);
    if (!story) return undefined;
    const updated = { ...story, ...updates, updatedAt: new Date() };
    this.stories.set(id, updated);
    return updated;
  }

  async deleteStory(id: string): Promise<boolean> {
    return this.stories.delete(id);
  }

  // Content
  async getContent(id: string): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async getContentByStory(storyId: string): Promise<Content[]> {
    return Array.from(this.content.values()).filter((c) => c.storyId === storyId);
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = randomUUID();
    const content: Content = {
      id,
      storyId: insertContent.storyId,
      channel: insertContent.channel,
      contentType: insertContent.contentType,
      title: insertContent.title ?? null,
      body: insertContent.body,
      status: insertContent.status ?? "draft",
      metadata: insertContent.metadata ?? null,
      generatedAt: new Date(),
    };
    this.content.set(id, content);
    return content;
  }

  // Assets
  async getAsset(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetsByStory(storyId: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter((a) => a.storyId === storyId);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = {
      id,
      storyId: insertAsset.storyId,
      assetType: insertAsset.assetType,
      fileName: insertAsset.fileName,
      fileUrl: insertAsset.fileUrl,
      platform: insertAsset.platform ?? null,
      dimensions: insertAsset.dimensions ?? null,
      fileSize: insertAsset.fileSize ?? null,
      status: insertAsset.status ?? "generated",
      metadata: insertAsset.metadata ?? null,
      createdAt: new Date(),
    };
    this.assets.set(id, asset);
    return asset;
  }

  // Packages
  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getPackagesByProject(projectId: string): Promise<Package[]> {
    return Array.from(this.packages.values()).filter((p) => p.projectId === projectId);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const shareableLink = `${getBaseUrl()}/package/${id}`;
    const pkg: Package = {
      id,
      projectId: insertPackage.projectId,
      storyId: insertPackage.storyId ?? null,
      name: insertPackage.name,
      description: insertPackage.description ?? null,
      status: insertPackage.status ?? "preparing",
      packageUrl: insertPackage.packageUrl ?? null,
      downloadCount: 0,
      shareableLink,
      expiresAt: insertPackage.expiresAt ?? null,
      createdAt: new Date(),
    };
    this.packages.set(id, pkg);
    return pkg;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    const pkg = this.packages.get(id);
    if (!pkg) return undefined;
    const updated = { ...pkg, ...updates };
    this.packages.set(id, updated);
    return updated;
  }

  async deletePackage(id: string): Promise<boolean> {
    return this.packages.delete(id);
  }
}

import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({ where: eq(schema.users.id, id) });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({ where: eq(schema.users.username, username) });
    return result;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    const result = await db.query.clients.findFirst({ where: eq(schema.clients.id, id) });
    return result;
  }

  async getClients(): Promise<Client[]> {
    return await db.query.clients.findMany();
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(schema.clients).values(insertClient as any).returning();
    return client;
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db.update(schema.clients).set(updates as any).where(eq(schema.clients.id, id)).returning();
    return client;
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.query.projects.findFirst({ where: eq(schema.projects.id, id) });
    return result;
  }

  async getProjects(): Promise<Project[]> {
    return await db.query.projects.findMany();
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return await db.query.projects.findMany({ where: eq(schema.projects.clientId, clientId) });
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(schema.projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db.update(schema.projects).set(updates).where(eq(schema.projects.id, id)).returning();
    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(schema.projects).where(eq(schema.projects.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Forms
  async getForm(id: string): Promise<Form | undefined> {
    const result = await db.query.forms.findFirst({ where: eq(schema.forms.id, id) });
    return result;
  }

  async getFormsByProject(projectId: string): Promise<Form[]> {
    return await db.query.forms.findMany({ where: eq(schema.forms.projectId, projectId) });
  }

  async createForm(insertForm: InsertForm): Promise<Form> {
    const id = randomUUID();
    const shareableLink = `${getBaseUrl()}/form/${id}`;
    const [form] = await db.insert(schema.forms).values({ 
      ...insertForm, 
      id,
      shareableLink 
    } as any).returning();
    return form;
  }

  async updateForm(id: string, updates: Partial<InsertForm>): Promise<Form | undefined> {
    const [form] = await db.update(schema.forms).set(updates as any).where(eq(schema.forms.id, id)).returning();
    return form;
  }

  async deleteForm(id: string): Promise<boolean> {
    // Get all submissions for this form
    const formSubmissions = await db.query.submissions.findMany({
      where: eq(schema.submissions.formId, id)
    });
    
    // For each submission, find and delete related stories (with their dependencies)
    for (const submission of formSubmissions) {
      const relatedStories = await db.query.stories.findMany({
        where: eq(schema.stories.submissionId, submission.id)
      });
      
      // Delete each story and its dependencies
      for (const story of relatedStories) {
        // Delete packages referencing this story
        await db.delete(schema.packages).where(eq(schema.packages.storyId, story.id));
        // Delete content and assets
        await db.delete(schema.content).where(eq(schema.content.storyId, story.id));
        await db.delete(schema.assets).where(eq(schema.assets.storyId, story.id));
        // Delete the story
        await db.delete(schema.stories).where(eq(schema.stories.id, story.id));
      }
    }
    
    // Now delete submissions
    await db.delete(schema.submissions).where(eq(schema.submissions.formId, id));
    // Finally delete the form
    const result = await db.delete(schema.forms).where(eq(schema.forms.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Submissions
  async getSubmission(id: string): Promise<Submission | undefined> {
    const result = await db.query.submissions.findFirst({ where: eq(schema.submissions.id, id) });
    return result;
  }

  async getSubmissionsByProject(projectId: string): Promise<Submission[]> {
    return await db.query.submissions.findMany({ where: eq(schema.submissions.projectId, projectId) });
  }

  async getSubmissionsByForm(formId: string): Promise<Submission[]> {
    return await db.query.submissions.findMany({ where: eq(schema.submissions.formId, formId) });
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db.insert(schema.submissions).values(insertSubmission).returning();
    return submission;
  }

  // Stories
  async getStory(id: string): Promise<Story | undefined> {
    const result = await db.query.stories.findFirst({ where: eq(schema.stories.id, id) });
    return result;
  }

  async getStories(): Promise<Story[]> {
    return await db.query.stories.findMany();
  }

  async getStoriesByProject(projectId: string): Promise<Story[]> {
    return await db.query.stories.findMany({ where: eq(schema.stories.projectId, projectId) });
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db.insert(schema.stories).values(insertStory).returning();
    return story;
  }

  async updateStory(id: string, updates: Partial<InsertStory>): Promise<Story | undefined> {
    const [story] = await db.update(schema.stories).set(updates).where(eq(schema.stories.id, id)).returning();
    return story;
  }

  async deleteStory(id: string): Promise<boolean> {
    // Cascade delete: first delete packages that reference this story
    await db.delete(schema.packages).where(eq(schema.packages.storyId, id));
    // Then delete all related content and assets
    await db.delete(schema.content).where(eq(schema.content.storyId, id));
    await db.delete(schema.assets).where(eq(schema.assets.storyId, id));
    // Finally delete the story
    const result = await db.delete(schema.stories).where(eq(schema.stories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Content
  async getContent(id: string): Promise<Content | undefined> {
    const result = await db.query.content.findFirst({ where: eq(schema.content.id, id) });
    return result;
  }

  async getContentByStory(storyId: string): Promise<Content[]> {
    return await db.query.content.findMany({ where: eq(schema.content.storyId, storyId) });
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [content] = await db.insert(schema.content).values(insertContent).returning();
    return content;
  }

  // Assets
  async getAsset(id: string): Promise<Asset | undefined> {
    const result = await db.query.assets.findFirst({ where: eq(schema.assets.id, id) });
    return result;
  }

  async getAssetsByStory(storyId: string): Promise<Asset[]> {
    return await db.query.assets.findMany({ where: eq(schema.assets.storyId, storyId) });
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const [asset] = await db.insert(schema.assets).values(insertAsset).returning();
    return asset;
  }

  // Packages
  async getPackage(id: string): Promise<Package | undefined> {
    const result = await db.query.packages.findFirst({ where: eq(schema.packages.id, id) });
    return result;
  }

  async getPackagesByProject(projectId: string): Promise<Package[]> {
    return await db.query.packages.findMany({ where: eq(schema.packages.projectId, projectId) });
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const shareableLink = `${getBaseUrl()}/package/${id}`;
    const [pkg] = await db.insert(schema.packages).values({ ...insertPackage, id, shareableLink }).returning();
    return pkg;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    const [pkg] = await db.update(schema.packages).set(updates).where(eq(schema.packages.id, id)).returning();
    return pkg;
  }

  async deletePackage(id: string): Promise<boolean> {
    const result = await db.delete(schema.packages).where(eq(schema.packages.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = process.env.NODE_ENV === "production" ? new DbStorage() : new DbStorage();
