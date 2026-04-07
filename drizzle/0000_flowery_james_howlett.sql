CREATE TABLE "campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'draft',
	"startDate" timestamp,
	"endDate" timestamp,
	"budget" numeric(15, 2),
	"targetAudience" jsonb,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" text NOT NULL,
	"industry" varchar(100),
	"website" varchar(255),
	"phone" varchar(20),
	"address" text,
	"city" varchar(100),
	"state" varchar(50),
	"country" varchar(100),
	"zipCode" varchar(20),
	"annualRevenue" numeric(15, 2),
	"employees" integer,
	"description" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"companyId" integer,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100),
	"email" varchar(320),
	"phone" varchar(20),
	"jobTitle" varchar(100),
	"department" varchar(100),
	"status" varchar(50) DEFAULT 'active',
	"tags" text[],
	"notes" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customFields" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"entityType" varchar(50) NOT NULL,
	"fieldName" varchar(100) NOT NULL,
	"fieldType" varchar(50) NOT NULL,
	"options" jsonb,
	"isRequired" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"stageId" integer NOT NULL,
	"contactId" integer,
	"companyId" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"value" numeric(15, 2) NOT NULL,
	"probability" integer DEFAULT 0,
	"expectedCloseDate" timestamp,
	"closedDate" timestamp,
	"status" varchar(50) DEFAULT 'open',
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"contactId" integer,
	"dealId" integer,
	"type" varchar(50) NOT NULL,
	"subject" varchar(255),
	"description" text,
	"duration" integer,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"contactId" integer,
	"companyId" integer,
	"source" varchar(100),
	"status" varchar(50) DEFAULT 'new',
	"leadScore" integer DEFAULT 0,
	"expectedValue" numeric(15, 2),
	"notes" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipelines" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"isDefault" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"config" jsonb NOT NULL,
	"data" jsonb,
	"lastGeneratedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"permissions" text[],
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"pipelineId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"order" integer NOT NULL,
	"probability" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"contactId" integer,
	"companyId" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"priority" varchar(50) DEFAULT 'medium',
	"status" varchar(50) DEFAULT 'open',
	"category" varchar(100),
	"assignedTo" integer,
	"dueDate" timestamp,
	"resolvedDate" timestamp,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"trigger" jsonb NOT NULL,
	"actions" jsonb NOT NULL,
	"isActive" boolean DEFAULT true,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customFields" ADD CONSTRAINT "customFields_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_stageId_stages_id_fk" FOREIGN KEY ("stageId") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_contactId_contacts_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_contactId_contacts_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_dealId_deals_id_fk" FOREIGN KEY ("dealId") REFERENCES "public"."deals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_contactId_contacts_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages" ADD CONSTRAINT "stages_pipelineId_pipelines_id_fk" FOREIGN KEY ("pipelineId") REFERENCES "public"."pipelines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_contactId_contacts_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assignedTo_users_id_fk" FOREIGN KEY ("assignedTo") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "campaigns_userId_idx" ON "campaigns" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "companies_userId_idx" ON "companies" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "contacts_userId_idx" ON "contacts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "contacts_companyId_idx" ON "contacts" USING btree ("companyId");--> statement-breakpoint
CREATE INDEX "customFields_userId_idx" ON "customFields" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "deals_userId_idx" ON "deals" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "deals_stageId_idx" ON "deals" USING btree ("stageId");--> statement-breakpoint
CREATE INDEX "deals_status_idx" ON "deals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "interactions_userId_idx" ON "interactions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "interactions_contactId_idx" ON "interactions" USING btree ("contactId");--> statement-breakpoint
CREATE INDEX "interactions_dealId_idx" ON "interactions" USING btree ("dealId");--> statement-breakpoint
CREATE INDEX "leads_userId_idx" ON "leads" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pipelines_userId_idx" ON "pipelines" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "reports_userId_idx" ON "reports" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "roles_userId_idx" ON "roles" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "stages_pipelineId_idx" ON "stages" USING btree ("pipelineId");--> statement-breakpoint
CREATE INDEX "tickets_userId_idx" ON "tickets" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "tickets_status_idx" ON "tickets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tickets_assignedTo_idx" ON "tickets" USING btree ("assignedTo");--> statement-breakpoint
CREATE INDEX "workflows_userId_idx" ON "workflows" USING btree ("userId");