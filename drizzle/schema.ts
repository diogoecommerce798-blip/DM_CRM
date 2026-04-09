import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ==================== ENUMS ====================

export const roleEnum = pgEnum("role_enum", ["user", "admin"]);
export const boolStrEnum = pgEnum("bool_str_enum", ["true", "false"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== CRM TABLES ====================

// 1. CONTACTS & LEADS
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
  industry: varchar("industry", { length: 100 }),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  country: varchar("country", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  annualRevenue: varchar("annualRevenue", { length: 50 }),
  employees: integer("employees"),
  description: text("description"),
  cnpj: varchar("cnpj", { length: 20 }),
  complement: text("complement"),
  companySize: varchar("companySize", { length: 50 }),
  registrationStatus: varchar("registrationStatus", { length: 50 }),
  potentialRating: varchar("potentialRating", { length: 50 }),
  openingDate: timestamp("openingDate"),
  ownerId: integer("ownerId"),
  tags: text("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  companyId: integer("companyId"),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  emailWork: varchar("emailWork", { length: 320 }),
  phoneWork: varchar("phoneWork", { length: 20 }),
  jobTitle: varchar("jobTitle", { length: 100 }),
  department: varchar("department", { length: 100 }),
  status: varchar("status", { length: 50 }).default("active"),
  tags: text("tags"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  contactId: integer("contactId"),
  companyId: integer("companyId"),
  source: varchar("source", { length: 100 }),
  status: varchar("status", { length: 50 }).default("new"),
  leadScore: integer("leadScore").default(0),
  expectedValue: varchar("expectedValue", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// 2. PIPELINE & DEALS
export const pipelines = pgTable("pipelines", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isDefault: boolStrEnum("isDefault").default("false"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Pipeline = typeof pipelines.$inferSelect;
export type InsertPipeline = typeof pipelines.$inferInsert;

export const stages = pgTable("stages", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipelineId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  order: integer("order").notNull(),
  probability: integer("probability").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Stage = typeof stages.$inferSelect;
export type InsertStage = typeof stages.$inferInsert;

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  stageId: integer("stageId").notNull(),
  contactId: integer("contactId"),
  companyId: integer("companyId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  value: varchar("value", { length: 50 }).notNull(),
  probability: integer("probability").default(0),
  expectedCloseDate: timestamp("expectedCloseDate"),
  closedDate: timestamp("closedDate"),
  status: varchar("status", { length: 50 }).default("open"),
  funnelId: integer("funnelId"),
  tags: text("tags"),
  source: varchar("source", { length: 100 }),
  visibility: varchar("visibility", { length: 50 }).default("everyone"),
  ownerId: integer("ownerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

// 3. INTERACTIONS & ACTIVITIES
export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  contactId: integer("contactId"),
  dealId: integer("dealId"),
  type: varchar("type", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  description: text("description"),
  duration: integer("duration"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = typeof interactions.$inferInsert;

// 4. MARKETING & CAMPAIGNS
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("draft"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  budget: varchar("budget", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

// 5. WORKFLOWS & AUTOMATION
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolStrEnum("isActive").default("true"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;

// 6. SUPPORT & TICKETS
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  contactId: integer("contactId"),
  companyId: integer("companyId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 50 }).default("medium"),
  status: varchar("status", { length: 50 }).default("open"),
  category: varchar("category", { length: 100 }),
  assignedTo: integer("assignedTo"),
  dueDate: timestamp("dueDate"),
  resolvedDate: timestamp("resolvedDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

// 7. REPORTS & ANALYTICS
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;
  type: varchar("type", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// 8. PERMISSIONS & ROLES
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

// 9. CUSTOM FIELDS
export const customFields = pgTable("customFields", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  fieldName: varchar("fieldName", { length: 100 }).notNull(),
  fieldType: varchar("fieldType", { length: 50 }).notNull(),
  isRequired: boolStrEnum("isRequired").default("false"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomField = typeof customFields.$inferSelect;
export type InsertCustomField = typeof customFields.$inferInsert;
