import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== CRM TABLES ====================

// 1. CONTACTS & LEADS
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
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
  employees: int("employees"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyId: int("companyId"),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  jobTitle: varchar("jobTitle", { length: 100 }),
  department: varchar("department", { length: 100 }),
  status: varchar("status", { length: 50 }).default("active"),
  tags: text("tags"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contactId: int("contactId"),
  companyId: int("companyId"),
  source: varchar("source", { length: 100 }),
  status: varchar("status", { length: 50 }).default("new"),
  leadScore: int("leadScore").default(0),
  expectedValue: varchar("expectedValue", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// 2. PIPELINE & DEALS
export const pipelines = mysqlTable("pipelines", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isDefault: mysqlEnum("isDefault", ["true", "false"]).default("false"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pipeline = typeof pipelines.$inferSelect;
export type InsertPipeline = typeof pipelines.$inferInsert;

export const stages = mysqlTable("stages", {
  id: int("id").autoincrement().primaryKey(),
  pipelineId: int("pipelineId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  order: int("order").notNull(),
  probability: int("probability").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Stage = typeof stages.$inferSelect;
export type InsertStage = typeof stages.$inferInsert;

export const deals = mysqlTable("deals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stageId: int("stageId").notNull(),
  contactId: int("contactId"),
  companyId: int("companyId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  value: varchar("value", { length: 50 }).notNull(),
  probability: int("probability").default(0),
  expectedCloseDate: timestamp("expectedCloseDate"),
  closedDate: timestamp("closedDate"),
  status: varchar("status", { length: 50 }).default("open"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

// 3. INTERACTIONS & ACTIVITIES
export const interactions = mysqlTable("interactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contactId: int("contactId"),
  dealId: int("dealId"),
  type: varchar("type", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  description: text("description"),
  duration: int("duration"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = typeof interactions.$inferInsert;

// 4. MARKETING & CAMPAIGNS
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("draft"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  budget: varchar("budget", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

// 5. WORKFLOWS & AUTOMATION
export const workflows = mysqlTable("workflows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;

// 6. SUPPORT & TICKETS
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contactId: int("contactId"),
  companyId: int("companyId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 50 }).default("medium"),
  status: varchar("status", { length: 50 }).default("open"),
  category: varchar("category", { length: 100 }),
  assignedTo: int("assignedTo"),
  dueDate: timestamp("dueDate"),
  resolvedDate: timestamp("resolvedDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

// 7. REPORTS & ANALYTICS
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// 8. PERMISSIONS & ROLES
export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

// 9. CUSTOM FIELDS
export const customFields = mysqlTable("customFields", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  fieldName: varchar("fieldName", { length: 100 }).notNull(),
  fieldType: varchar("fieldType", { length: 50 }).notNull(),
  isRequired: mysqlEnum("isRequired", ["true", "false"]).default("false"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomField = typeof customFields.$inferSelect;
export type InsertCustomField = typeof customFields.$inferInsert;