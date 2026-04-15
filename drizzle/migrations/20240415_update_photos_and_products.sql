-- Script para atualizar a tabela opportunity_photos e criar deal_products

-- 1. Adicionar coluna product_id na tabela opportunity_photos
ALTER TABLE opportunity_photos ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id) ON DELETE SET NULL;

-- 2. Criar a tabela deal_products para vincular produtos aos negócios
CREATE TABLE IF NOT EXISTS deal_products (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    price_at_time TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS na nova tabela
ALTER TABLE deal_products ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de segurança para deal_products
CREATE POLICY "Permitir leitura para usuários autenticados" 
ON deal_products FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir inserção para usuários autenticados" 
ON deal_products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir exclusão para usuários autenticados" 
ON deal_products FOR DELETE 
TO authenticated 
USING (true);

-- 5. Atualizar políticas da tabela opportunity_photos (se necessário)
-- As políticas anteriores já cobrem as operações básicas, mas garantimos que estão ativas
ALTER TABLE opportunity_photos ENABLE ROW LEVEL SECURITY;
