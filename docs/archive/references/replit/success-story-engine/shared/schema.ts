import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Clients (adult education institutions)
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  institutionType: text("institution_type"),
  logoUrl: text("logo_url"),
  brandColors: jsonb("brand_colors").$type<{ primary?: string; secondary?: string }>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Projects (campaigns for each client)
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("planning"),
  storyCount: integer("story_count").default(0),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  deadline: z.union([z.string(), z.date(), z.null(), z.undefined()]).optional().transform((val) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Form Templates
export const forms = pgTable("forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  storyType: text("story_type").notNull(),
  fields: jsonb("fields").notNull().$type<Array<{
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
  }>>(),
  shareableLink: text("shareable_link"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFormSchema = createInsertSchema(forms).omit({ 
  id: true, 
  createdAt: true,
  shareableLink: true 
});
export type InsertForm = z.infer<typeof insertFormSchema>;
export type Form = typeof forms.$inferSelect;

// Form Submissions
export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  formId: varchar("form_id").notNull().references(() => forms.id),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  submitterName: text("submitter_name"),
  submitterEmail: text("submitter_email"),
  data: jsonb("data").notNull().$type<Record<string, any>>(),
  photoUrls: text("photo_urls").array(),
  status: text("status").notNull().default("submitted"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({ 
  id: true, 
  submittedAt: true,
  status: true 
});
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Stories (success stories in production)
export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  submissionId: varchar("submission_id").references(() => submissions.id),
  title: text("title").notNull(),
  storyType: text("story_type").notNull(),
  subjectName: text("subject_name"),
  status: text("status").notNull().default("form_sent"),
  currentStage: text("current_stage").notNull().default("form_sent"),
  sourceData: jsonb("source_data").$type<Record<string, any>>(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStorySchema = createInsertSchema(stories).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

// Content (AI-generated content for each story)
export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id").notNull().references(() => stories.id),
  channel: text("channel").notNull(),
  contentType: text("content_type").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  status: text("status").notNull().default("draft"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(content).omit({ 
  id: true, 
  generatedAt: true 
});
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

// Assets (graphics, videos, etc.)
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id").notNull().references(() => stories.id),
  assetType: text("asset_type").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  platform: text("platform"),
  dimensions: text("dimensions"),
  fileSize: integer("file_size"),
  status: text("status").notNull().default("generated"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAssetSchema = createInsertSchema(assets).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// Packages (bundled deliverables for clients)
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  storyId: varchar("story_id").references(() => stories.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("preparing"),
  packageUrl: text("package_url"),
  downloadCount: integer("download_count").default(0),
  shareableLink: text("shareable_link"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({ 
  id: true, 
  createdAt: true,
  downloadCount: true 
});
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;
