-- Script para criar a tabela opportunity_photos e bucket no Supabase

-- 1. Criar a tabela opportunity_photos
CREATE TABLE IF NOT EXISTS opportunity_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by INTEGER REFERENCES users(id)
);

-- 2. Habilitar RLS na tabela
ALTER TABLE opportunity_photos ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de segurança para a tabela opportunity_photos
CREATE POLICY "Permitir leitura para usuários autenticados" 
ON opportunity_photos FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir inserção para usuários autenticados" 
ON opportunity_photos FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir atualização para usuários autenticados" 
ON opportunity_photos FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Permitir exclusão para usuários autenticados" 
ON opportunity_photos FOR DELETE 
TO authenticated 
USING (true);

-- 4. Instruções para o Supabase Storage (Buckets)
-- Criar bucket 'opportunity-photos' manualmente no console do Supabase
-- Ou via SQL (se as permissões permitirem):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('opportunity-photos', 'opportunity-photos', true);

-- 5. Políticas para o Storage (Buckets)
-- Substitua 'opportunity-photos' pelo nome do bucket se for diferente.

-- Permitir que usuários autenticados façam upload de fotos
-- CREATE POLICY "Upload de fotos para usuários autenticados"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'opportunity-photos');

-- Permitir que qualquer um visualize fotos públicas
-- CREATE POLICY "Visualização pública de fotos"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'opportunity-photos');

-- Permitir exclusão de fotos pelo proprietário (ou qualquer autenticado neste contexto de CRM)
-- CREATE POLICY "Exclusão de fotos para usuários autenticados"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'opportunity-photos');
