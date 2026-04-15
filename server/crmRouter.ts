import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc.js";
import * as db from "./db.js";
import * as schema from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";

export const crmRouter = router({
  // NEGÓCIOS (DEALS)
  listDeals: publicProcedure.query(async ({ ctx }) => {
    const deals = await db.getDb().then(d => d.select().from(schema.deals));
    return deals;
  }),

  createDeal: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      value: z.string(),
      stageId: z.number(),
      contactId: z.number().optional(),
      companyId: z.number().optional(),
      contactName: z.string().optional(),
      companyName: z.string().optional(),
      probability: z.number().optional(),
      funnelId: z.number().optional(),
      source: z.string().optional(),
      visibility: z.string().optional(),
      ownerId: z.number().optional(),
      tags: z.string().optional(),
      phone: z.string().optional(),
      phoneType: z.string().optional(),
      email: z.string().optional(),
      emailType: z.string().optional(),
      address: z.string().optional(),
      potentialRating: z.string().optional(),
      openingDate: z.string().optional(),
      companySize: z.string().optional(),
      registrationStatus: z.string().optional(),
      cnpj: z.string().optional(),
      complement: z.string().optional(),
      description: z.string().optional(),
      expectedCloseDate: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const { openingDate, expectedCloseDate, ...data } = input;
      const result = await db.getDb().then(d => 
        d.insert(schema.deals).values({
          ...data,
          openingDate: openingDate ? new Date(openingDate) : null,
          expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
          userId: ctx.user!.id,
        }).returning()
      );
      return result[0];
    }),

  updateDeal: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      value: z.string().optional(),
      stageId: z.number().optional(),
      contactId: z.number().optional(),
      companyId: z.number().optional(),
      contactName: z.string().optional(),
      companyName: z.string().optional(),
      probability: z.number().optional(),
      status: z.string().optional(),
      funnelId: z.number().optional(),
      source: z.string().optional(),
      visibility: z.string().optional(),
      ownerId: z.number().optional(),
      tags: z.string().optional(),
      phone: z.string().optional(),
      phoneType: z.string().optional(),
      email: z.string().optional(),
      emailType: z.string().optional(),
      address: z.string().optional(),
      potentialRating: z.string().optional(),
      openingDate: z.string().optional(),
      companySize: z.string().optional(),
      registrationStatus: z.string().optional(),
      cnpj: z.string().optional(),
      complement: z.string().optional(),
      description: z.string().optional(),
      expectedCloseDate: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const { id, openingDate, expectedCloseDate, ...data } = input;
      const result = await db.getDb().then(d => 
        d.update(schema.deals)
          .set({ 
            ...data, 
            openingDate: openingDate ? new Date(openingDate) : undefined,
            expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : undefined,
            updatedAt: new Date() 
          })
          .where(eq(schema.deals.id, id))
          .returning()
      );
      return result[0];
    }),

  deleteDeal: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      await db.getDb().then(d => 
        d.delete(schema.deals).where(eq(schema.deals.id, input))
      );
      return { success: true };
    }),

  // ESTÁGIOS (STAGES)
  listStages: publicProcedure.query(async () => {
    return await db.getDb().then(d => d.select().from(schema.stages));
  }),

  createStage: publicProcedure
    .input(z.object({
      pipelineId: z.number(),
      name: z.string().min(1),
      order: z.number(),
      probability: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const result = await db.getDb().then(d => 
        d.insert(schema.stages).values(input).returning()
      );
      return result[0];
    }),

  updateStage: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      order: z.number().optional(),
      probability: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const { id, ...data } = input;
      const result = await db.getDb().then(d => 
        d.update(schema.stages)
          .set(data)
          .where(eq(schema.stages.id, id))
          .returning()
      );
      return result[0];
    }),

  deleteStage: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      await db.getDb().then(d => 
        d.delete(schema.stages).where(eq(schema.stages.id, input))
      );
      return { success: true };
    }),

  // NOTAS (NOTES)
  listNotes: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    return await db.getDb().then(d => 
      d.select().from(schema.notes).where(eq(schema.notes.userId, ctx.user!.id))
    );
  }),

  createNote: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const result = await db.getDb().then(d => 
        d.insert(schema.notes).values({
          ...input,
          userId: ctx.user!.id,
        }).returning()
      );
      return result[0];
    }),

  updateNote: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const { id, ...data } = input;
      const result = await db.getDb().then(d => 
        d.update(schema.notes)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(schema.notes.id, id))
          .returning()
      );
      return result[0];
    }),

  // FOTOS (OPPORTUNITY PHOTOS)
  listOpportunityPhotos: publicProcedure
    .input(z.object({ 
      opportunityId: z.number(),
      productId: z.number().optional()
    }))
    .query(async ({ input }) => {
      let query = db.getDb().then(d => 
        d.select().from(schema.opportunityPhotos)
          .where(eq(schema.opportunityPhotos.opportunityId, input.opportunityId))
      );
      
      if (input.productId) {
        query = db.getDb().then(d => 
          d.select().from(schema.opportunityPhotos)
            .where(and(
              eq(schema.opportunityPhotos.opportunityId, input.opportunityId),
              eq(schema.opportunityPhotos.productId, input.productId)
            ))
        );
      }

      return await query.then(rows => rows.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()));
    }),

  addOpportunityPhoto: publicProcedure
    .input(z.object({
      opportunityId: z.number(),
      productId: z.number().optional(),
      fileName: z.string(),
      filePath: z.string(),
      publicUrl: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const result = await db.getDb().then(d => 
        d.insert(schema.opportunityPhotos).values({
          ...input,
          uploadedBy: ctx.user!.id,
        }).returning()
      );
      return result[0];
    }),

  updateOpportunityPhotoDescription: publicProcedure
    .input(z.object({
      id: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const result = await db.getDb().then(d => 
        d.update(schema.opportunityPhotos)
          .set({ description: input.description })
          .where(eq(schema.opportunityPhotos.id, input.id))
          .returning()
      );
      return result[0];
    }),

  deleteOpportunityPhoto: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      await db.getDb().then(d => 
        d.delete(schema.opportunityPhotos).where(eq(schema.opportunityPhotos.id, input))
      );
      return { success: true };
    }),

  // PRODUTOS DO NEGÓCIO (DEAL PRODUCTS)
  listDealProducts: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const result = await db.getDb().then(d => 
        d.select({
          id: schema.products.id,
          name: schema.products.name,
          price: schema.products.price,
          quantity: schema.dealProducts.quantity,
          dealProductId: schema.dealProducts.id,
        })
        .from(schema.dealProducts)
        .innerJoin(schema.products, eq(schema.dealProducts.productId, schema.products.id))
        .where(eq(schema.dealProducts.dealId, input))
      );
      return result;
    }),

  addDealProduct: publicProcedure
    .input(z.object({
      dealId: z.number(),
      productId: z.number(),
      quantity: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const result = await db.getDb().then(d => 
        d.insert(schema.dealProducts).values(input).returning()
      );
      return result[0];
    }),

  deleteDealProduct: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      await db.getDb().then(d => 
        d.delete(schema.dealProducts).where(eq(schema.dealProducts.id, input))
      );
      return { success: true };
    }),

  deleteNote: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      await db.getDb().then(d => 
        d.delete(schema.notes).where(eq(schema.notes.id, input))
      );
      return { success: true };
    }),

  updateNote: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const { id, ...data } = input;
      const result = await db.getDb().then(d => 
        d.update(schema.notes)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(schema.notes.id, id))
          .returning()
      );
      return result[0];
    }),

  // ORGANIZAÇÕES (COMPANIES)
  listCompanies: publicProcedure.query(async () => {
    return await db.getDb().then(d => d.select().from(schema.companies));
  }),

  createCompany: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      industry: z.string().optional(),
      website: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
      cnpj: z.string().optional(),
      complement: z.string().optional(),
      companySize: z.string().optional(),
      registrationStatus: z.string().optional(),
      potentialRating: z.string().optional(),
      openingDate: z.string().optional(), // ISO string
      tags: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const result = await db.getDb().then(d => 
        d.insert(schema.companies).values({
          ...input,
          userId: ctx.user!.id,
          openingDate: input.openingDate ? new Date(input.openingDate) : null,
        }).returning()
      );
      return result[0];
    }),

  // PESSOAS (CONTACTS)
  listContacts: publicProcedure.query(async () => {
    return await db.getDb().then(d => d.select().from(schema.contacts));
  }),

  createContact: publicProcedure
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      emailWork: z.string().email().optional(),
      phoneWork: z.string().optional(),
      jobTitle: z.string().optional(),
      department: z.string().optional(),
      companyId: z.number().optional(),
      tags: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const result = await db.getDb().then(d => 
        d.insert(schema.contacts).values({
          ...input,
          userId: ctx.user!.id,
        }).returning()
      );
      return result[0];
    }),

  updateContact: publicProcedure
    .input(z.object({
      id: z.number(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      jobTitle: z.string().optional(),
      department: z.string().optional(),
      status: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const { id, ...data } = input;
      const result = await db.getDb().then(d => 
        d.update(schema.contacts)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(schema.contacts.id, id))
          .returning()
      );
      return result[0];
    }),

  deleteContact: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      await db.getDb().then(d => 
        d.delete(schema.contacts).where(eq(schema.contacts.id, input))
      );
      return { success: true };
    }),

  // PRODUTOS (PRODUCTS)
  listProducts: publicProcedure.query(async () => {
    return await db.getDb().then(d => d.select().from(schema.products));
  }),

  createProduct: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      code: z.string().min(1),
      price: z.number(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const result = await db.getDb().then(d => 
        d.insert(schema.products).values({
          ...input,
          price: String(input.price),
        }).returning()
      );
      return result[0];
    }),

  // USUÁRIOS (USERS)
  listUsers: publicProcedure.query(async () => {
    return await db.getDb().then(d => d.select().from(schema.users));
  }),

  updateUser: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      email: z.string().optional(),
      role: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const { id, ...data } = input;
      const result = await db.getDb().then(d => 
        d.update(schema.users)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(schema.users.id, id))
          .returning()
      );
      return result[0];
    }),

  getDeal: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const result = await db.getDb().then(d => 
        d.select().from(schema.deals).where(eq(schema.deals.id, input))
      );
      return result[0];
    }),
});
