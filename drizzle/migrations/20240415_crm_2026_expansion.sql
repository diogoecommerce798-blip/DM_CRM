-- Script de expansão do schema para funcionalidades avançadas CRM 2026

-- 1. Atualizar tabela interactions (atividades)
ALTER TABLE interactions ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;
ALTER TABLE interactions ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium';
ALTER TABLE interactions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE interactions ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE interactions ADD COLUMN IF NOT EXISTS participants TEXT;

-- 2. Criar tabela whatsapp_messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    direction VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'sent',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Atualizar tabela notes
ALTER TABLE notes ADD COLUMN IF NOT EXISTS "dealId" INTEGER REFERENCES deals(id) ON DELETE CASCADE;

-- 4. Criar tabela ai_summaries
CREATE TABLE IF NOT EXISTS ai_summaries (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
    summary TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Atualizar tabela products (Bling ERP)
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit VARCHAR(20) DEFAULT 'un';
ALTER TABLE products ADD COLUMN IF NOT EXISTS bling_id VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- 6. Habilitar RLS
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whatsapp_messages_authenticated" ON whatsapp_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "ai_summaries_authenticated" ON ai_summaries FOR ALL TO authenticated USING (true);
