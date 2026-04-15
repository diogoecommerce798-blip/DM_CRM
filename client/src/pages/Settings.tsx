import { useState } from "react";
import { 
  Settings, 
  Puzzle, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Save,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function SettingsPage() {
  const [blingKey, setBlingKey] = useState("");
  const [trelloKey, setTrelloKey] = useState("");
  const [trelloToken, setTrelloToken] = useState("");

  const syncMutation = trpc.crm.syncWithBling.useMutation({
    onSuccess: (data) => toast.success(data.message),
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const handleSaveBling = () => {
    if (!blingKey) return toast.error("Insira a chave API do Bling");
    toast.success("Configurações do Bling salvas!");
  };

  const handleSaveTrello = () => {
    if (!trelloKey || !trelloToken) return toast.error("Insira a chave e o token do Trello");
    toast.success("Configurações do Trello salvas!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          Configurações do Sistema
        </h1>
        <p className="text-gray-500">Gerencie as integrações e preferências globais do seu CRM.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bling ERP Integration */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-orange-50/50 border-b border-orange-100">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <Puzzle className="w-5 h-5" />
                  Bling ERP (API v3)
                </CardTitle>
                <CardDescription className="text-orange-600/70 mt-1">Sincronize produtos, estoque e pedidos.</CardDescription>
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 uppercase text-[10px]">ERP</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Chave API (Access Token)</label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    placeholder="Insira seu token do Bling" 
                    value={blingKey}
                    onChange={(e) => setBlingKey(e.target.value)}
                    className="border-gray-200"
                  />
                  <Button size="icon" variant="outline" className="shrink-0" onClick={handleSaveBling}>
                    <Save size={18} />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex gap-3">
                <Info className="text-blue-500 shrink-0" size={18} />
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-600 font-medium">Como obter a chave?</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Acesse o painel do Bling: <strong>Configurações → Sistema → API e Webhooks</strong>. 
                    Crie um usuário API e copie o token gerado.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <Button 
                variant="outline" 
                className="w-full justify-between group"
                onClick={() => syncMutation.mutate({ entity: 'products' })}
                disabled={syncMutation.isPending}
              >
                <span className="flex items-center gap-2">
                  <RefreshCcw className={`w-4 h-4 text-orange-500 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                  Sincronizar Produtos
                </span>
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <p className="text-[10px] text-gray-400 text-center italic">Última sincronização: Nunca</p>
            </div>
          </CardContent>
        </Card>

        {/* Trello Integration */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Puzzle className="w-5 h-5" />
                  Trello (Power-Up)
                </CardTitle>
                <CardDescription className="text-blue-600/70 mt-1">Vincule cartões do Trello a negócios.</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 uppercase text-[10px]">Tasks</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Chave API (Key)</label>
                <Input 
                  placeholder="Insira sua API Key do Trello" 
                  value={trelloKey}
                  onChange={(e) => setTrelloKey(e.target.value)}
                  className="border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Token de Acesso</label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    placeholder="Insira seu Token do Trello" 
                    value={trelloToken}
                    onChange={(e) => setTrelloToken(e.target.value)}
                    className="border-gray-200"
                  />
                  <Button size="icon" variant="outline" className="shrink-0" onClick={handleSaveTrello}>
                    <Save size={18} />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex gap-3">
                <Info className="text-blue-500 shrink-0" size={18} />
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-600 font-medium">Documentação Atlassian</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Gere suas credenciais em <a href="https://trello.com/power-ups/admin" target="_blank" className="text-blue-600 hover:underline">trello.com/power-ups/admin</a>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-2">
                  <XCircle className="text-red-500 w-4 h-4" />
                  <span className="text-xs font-medium text-red-700">Desconectado</span>
                </div>
                <Button variant="link" className="text-xs text-red-600 h-auto p-0 font-bold">Conectar Agora</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Future AI Configurations */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Preferências de Inteligência Artificial</CardTitle>
          <CardDescription>Configure como a IA deve atuar no resumo de negócios e sugestões.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 text-gray-400 italic text-sm">
            Configurações de IA (OpenAI / Grok) em desenvolvimento para a Geração 2026.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
