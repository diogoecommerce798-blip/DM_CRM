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
      dealId: z.number().optional(),
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
      const d = await db.getDb();
      let conditions = [eq(schema.opportunityPhotos.opportunityId, input.opportunityId)];
      
      if (input.productId) {
        conditions.push(eq(schema.opportunityPhotos.productId, input.productId));
      }

      const photos = await d.select()
        .from(schema.opportunityPhotos)
        .where(and(...conditions));

      return photos.sort((a: any, b: any) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
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

  // ATIVIDADES / INTERAÇÕES
  listActivities: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getDb().then(d => 
        d.select().from(schema.interactions)
          .where(eq(schema.interactions.dealId, input))
          .orderBy(schema.interactions.createdAt)
      );
    }),

  createActivity: publicProcedure
    .input(z.object({
      dealId: z.number(),
      type: z.string(),
      subject: z.string(),
      description: z.string().optional(),
      dueDate: z.string().optional(),
      priority: z.string().optional(),
      location: z.string().optional(),
      participants: z.string().optional(),
      duration: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const result = await db.getDb().then(d => 
        d.insert(schema.interactions).values({
          ...input,
          userId: ctx.user!.id,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        }).returning()
      );
      return result[0];
    }),

  // WHATSAPP
  listWhatsappMessages: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getDb().then(d => 
        d.select().from(schema.whatsappMessages)
          .where(eq(schema.whatsappMessages.dealId, input))
          .orderBy(schema.whatsappMessages.timestamp)
      );
    }),

  logWhatsappMessage: publicProcedure
    .input(z.object({
      dealId: z.number(),
      contactId: z.number().optional(),
      message: z.string(),
      direction: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const result = await db.getDb().then(d => 
        d.insert(schema.whatsappMessages).values(input).returning()
      );
      return result[0];
    }),

  // AI SUMMARY
  getAiSummary: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const result = await db.getDb().then(d => 
        d.select().from(schema.aiSummaries)
          .where(eq(schema.aiSummaries.dealId, input))
          .orderBy(schema.aiSummaries.createdAt)
      );
      return result[result.length - 1];
    }),

  generateAiSummary: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      // Placeholder para integração com IA (OpenAI/Grok)
      const summary = "Esta oportunidade está em progresso. O cliente demonstrou interesse inicial e aguarda uma proposta formal. Próximo passo sugerido: Enviar orçamento detalhado até o final da semana.";
      
      const result = await db.getDb().then(d => 
        d.insert(schema.aiSummaries).values({
          dealId: input,
          summary,
        }).returning()
      );
      return result[0];
    }),

  // HISTÓRICO CRONOLÓGICO (Timeline)
  getDealTimeline: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const db_conn = await db.getDb();
      
      const activities = await db_conn.select().from(schema.interactions).where(eq(schema.interactions.dealId, input));
      const dealNotes = await db_conn.select().from(schema.notes).where(eq(schema.notes.dealId, input));
      const photos = await db_conn.select().from(schema.opportunityPhotos).where(eq(schema.opportunityPhotos.opportunityId, input));
      const whatsapp = await db_conn.select().from(schema.whatsappMessages).where(eq(schema.whatsappMessages.dealId, input));

      const timeline = [
        ...activities.map((a: any) => ({ type: 'activity', date: a.createdAt, data: a })),
        ...dealNotes.map((n: any) => ({ type: 'note', date: n.createdAt, data: n })),
        ...photos.map((p: any) => ({ type: 'photo', date: p.uploadedAt, data: p })),
        ...whatsapp.map((w: any) => ({ type: 'whatsapp', date: w.timestamp, data: w })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      return timeline;
    }),

  // BLING ERP INTEGRATION (PLACEHOLDERS)
  syncWithBling: publicProcedure
    .input(z.object({
      entity: z.enum(['products', 'contacts', 'orders']),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      // Placeholder para integração Bling API v3
      // Endpoint: https://www.bling.com.br/Api/v3/produtos
      // Headers: { "Authorization": `Bearer ${process.env.BLING_API_KEY}` }
      return { success: true, message: `Sincronização de ${input.entity} com Bling iniciada.` };
    }),

  // AI SALES LAYER
  analyzeDealWithAI: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const db_conn = await db.getDb();
      const deal = await db_conn.select().from(schema.deals).where(eq(schema.deals.id, input)).then(r => r[0]);
      const notes = await db_conn.select().from(schema.notes).where(eq(schema.notes.dealId, input));
      
      const fullText = notes.map(n => n.content).join("\n");
      
      // Simulação de extração via LLM (OpenAI/Grok)
      // Em produção: const response = await openai.chat.completions.create(...)
      const analysis = {
        budget: "R$ 50.000,00",
        decisionMaker: "João Silva (Diretor Financeiro)",
        timeline: "Q3 2026",
        score: 85,
        summary: "Lead altamente qualificado. Orçamento confirmado e decisor mapeado. Urgência média."
      };
      
      await db_conn.insert(schema.aiSummaries).values({
        dealId: input,
        summary: analysis.summary,
      });

      // Atualizar o deal com campos extraídos se necessário
      await db_conn.update(schema.deals)
        .set({ 
          potentialRating: analysis.score.toString(),
          description: `Análise IA: Budget ${analysis.budget} | Decisor: ${analysis.decisionMaker} | Timeline: ${analysis.timeline}`
        })
        .where(eq(schema.deals.id, input));

      return analysis;
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
