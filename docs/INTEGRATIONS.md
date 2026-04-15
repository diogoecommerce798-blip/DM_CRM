# Guia de Integrações CRM 2026 - Nexus CRM

Este documento descreve como ativar as integrações avançadas solicitadas.

## 1. Bling ERP (API v3)

O sistema já está preparado para sincronização com o Bling.

### Configuração
1. Obtenha sua **API Key** no painel do Bling (Configurações -> Sistema -> API e Webhooks).
2. Adicione a variável de ambiente no seu arquivo `.env` ou no painel da Vercel:
   ```env
   BLING_API_KEY=seu_token_aqui
   ```

### Endpoints Principais (API v3)
As Server Actions devem ser expandidas utilizando os seguintes endpoints:
- **Produtos**: `GET https://www.bling.com.br/Api/v3/produtos`
- **Contatos**: `GET https://www.bling.com.br/Api/v3/contatos`
- **Pedidos**: `POST https://www.bling.com.br/Api/v3/pedidos`
- **Estoque**: `GET https://www.bling.com.br/Api/v3/estoque`

### Próximos Passos
- Implementar o webhook do Bling para atualizar o estoque em tempo real no CRM.
- Criar a lógica de conversão de "Negócio Ganho" em "Pedido de Venda" no Bling.

---

## 2. WhatsApp Business Cloud API (Meta)

A aba WhatsApp já possui a interface e o banco de dados prontos para receber mensagens.

### Configuração
1. Crie um app no [Meta for Developers](https://developers.facebook.com/).
2. Adicione o produto **WhatsApp**.
3. Configure o **Webhook** para apontar para `/api/webhooks/whatsapp`.
4. Adicione as variáveis:
   ```env
   WHATSAPP_ACCESS_TOKEN=...
   WHATSAPP_PHONE_NUMBER_ID=...
   WHATSAPP_VERIFY_TOKEN=...
   ```

### Fluxo de Mensagens
- **Entrada**: O Webhook recebe o JSON da Meta, identifica o `contact_id` pelo número de telefone e insere na tabela `whatsapp_messages` com `direction='in'`.
- **Saída**: A Server Action `sendWhatsappMessage` (a implementar) chama a API da Meta e registra com `direction='out'`.

---

## 3. Inteligência Artificial (AI)

O botão "Resumir com IA" está funcional com um placeholder.

### Como expandir:
1. **Integração**: Utilize o SDK da OpenAI ou Anthropic.
2. **Contexto**: O prompt enviado para a IA deve conter:
   - Título e valor do negócio.
   - Histórico da timeline (obtido via `getDealTimeline`).
   - Notas recentes.
3. **Prompt Sugerido**:
   > "Aja como um gerente de vendas sênior. Baseado no histórico de interações abaixo, resuma o status atual desta oportunidade e sugira o próximo passo mais crítico para o vendedor."

---

## 4. Automações de Follow-up

Utilize o Supabase **Edge Functions** + **pg_net** para agendar tarefas:
- Se um negócio ficar parado na mesma etapa por mais de 3 dias, disparar um e-mail ou notificação interna.
- Se o valor for superior a R$ 50.000,00, marcar automaticamente como prioridade "Alta".
