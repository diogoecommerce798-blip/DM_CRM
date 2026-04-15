import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { 
  ChevronLeft, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  FileText, 
  Files, 
  Receipt, 
  Camera,
  MoreHorizontal,
  Edit2,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Package,
  Plus,
  MessageCircle,
  Sparkles,
  Archive,
  History,
  Send,
  Video,
  UserPlus,
  ExternalLink,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import OpportunityPhotos from "@/components/OpportunityPhotos";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

// ==================== SUB-COMPONENTS ====================

function TimelineTab({ dealId }: { dealId: number }) {
  const utils = trpc.useUtils();
  const { data: timeline, isLoading } = trpc.crm.getDealTimeline.useQuery(dealId);
  const [newNote, setNewNote] = useState("");

  const createNoteMutation = trpc.crm.createNote.useMutation({
    onSuccess: () => {
      utils.crm.getDealTimeline.invalidate(dealId);
      setNewNote("");
      toast.success("Anotação salva!");
    },
  });

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    createNoteMutation.mutate({ 
      title: "Anotação", 
      content: newNote,
      dealId 
    });
  };

  if (isLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto mt-10" />;

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <Textarea 
            placeholder="Escreva uma anotação..." 
            className="min-h-[100px] border-none focus-visible:ring-0 p-0 resize-none text-sm"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">Pressione Cmd+Enter para salvar</span>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveNote}>
              Salvar anotação
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <History size={16} /> Histórico de Atividades
        </h3>
        
        <div className="space-y-4 relative before:absolute before:left-[17px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
          {timeline?.map((item, idx) => (
            <div key={idx} className="flex gap-4 relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white ${
                item.type === 'activity' ? 'bg-blue-100 text-blue-600' :
                item.type === 'note' ? 'bg-amber-100 text-amber-600' :
                item.type === 'photo' ? 'bg-purple-100 text-purple-600' :
                'bg-green-100 text-green-600'
              }`}>
                {item.type === 'activity' && <Calendar size={16} />}
                {item.type === 'note' && <MessageSquare size={16} />}
                {item.type === 'photo' && <Camera size={16} />}
                {item.type === 'whatsapp' && <MessageCircle size={16} />}
              </div>
              <div className="flex-1 pt-1.5 pb-4 border-b border-gray-50 last:border-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900">
                    {item.type === 'activity' ? item.data.subject :
                     item.type === 'note' ? 'Anotação adicionada' :
                     item.type === 'photo' ? `Foto: ${item.data.fileName}` :
                     'Mensagem de WhatsApp'}
                  </p>
                  <span className="text-[10px] text-gray-400 uppercase">
                    {format(new Date(item.date), "dd MMM, HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {item.type === 'activity' && <p>{item.data.description}</p>}
                  {item.type === 'note' && <p>{item.data.content}</p>}
                  {item.type === 'photo' && (
                    <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
                      <img src={item.data.publicUrl} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {item.type === 'whatsapp' && <p>{item.data.message}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivitiesTab({ dealId }: { dealId: number }) {
  const utils = trpc.useUtils();
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("Reunião");

  const createActivityMutation = trpc.crm.createActivity.useMutation({
    onSuccess: () => {
      utils.crm.getDealTimeline.invalidate(dealId);
      setSubject("");
      toast.success("Atividade agendada!");
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="p-4 border-b border-gray-100">
            <CardTitle className="text-sm font-bold uppercase text-gray-500">Agendar Atividade</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg w-fit">
              {['Reunião', 'Chamada', 'Tarefa', 'Email'].map(t => (
                <Button 
                  key={t}
                  variant={type === t ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`text-xs h-8 ${type === t ? 'bg-blue-600' : 'text-gray-500'}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
            
            <Input 
              placeholder="Assunto da atividade..." 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-gray-200"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Data e Hora</label>
                <Input type="datetime-local" className="border-gray-200 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Duração</label>
                <Select defaultValue="30">
                  <SelectTrigger className="border-gray-200 text-sm">
                    <SelectValue placeholder="30 min" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Localização / Link</label>
              <div className="relative">
                <Video className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <Input placeholder="Adicionar local ou link de vídeo" className="pl-10 border-gray-200" />
              </div>
            </div>

            <Textarea placeholder="Descrição..." className="min-h-[100px] border-gray-200" />

            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium cursor-pointer hover:underline">
              <UserPlus size={16} /> Adicionar convidados
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm">Cancelar</Button>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => createActivityMutation.mutate({ dealId, type, subject })}
              >
                Agendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-4">
        <Card className="border-gray-200 shadow-sm h-full">
          <CardHeader className="p-4 border-b border-gray-100">
            <CardTitle className="text-sm font-bold uppercase text-gray-500">Calendário</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex items-center justify-center">
            <p className="text-xs text-gray-400 italic text-center">Calendário interativo em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WhatsAppTab({ dealId }: { dealId: number }) {
  const { data: deal } = trpc.crm.getDeal.useQuery(dealId);
  const { data: messages } = trpc.crm.listWhatsappMessages.useQuery(dealId);
  
  const handleOpenWA = () => {
    if (!deal?.phone) {
      toast.error("Telefone não cadastrado!");
      return;
    }
    const cleanPhone = deal.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#075e54] p-4 flex items-center gap-4 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold">{deal?.contactName || "WhatsApp"}</h3>
            <p className="text-xs text-white/70">{deal?.phone || "Número não disponível"}</p>
          </div>
        </div>
        
        <CardContent className="p-6 min-h-[400px] bg-[#e5ddd5] flex flex-col">
          <div className="flex-1 space-y-4">
            {messages && messages.length > 0 ? (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg shadow-sm text-sm ${
                    m.direction === 'out' ? 'bg-[#dcf8c6]' : 'bg-white'
                  }`}>
                    <p>{m.message}</p>
                    <span className="text-[10px] text-gray-400 block text-right mt-1">
                      {format(new Date(m.timestamp), "HH:mm")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 mt-20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MessageCircle size={32} />
                </div>
                <p className="text-sm font-medium">Nenhuma mensagem registrada</p>
                <p className="text-xs max-w-xs text-center">As conversas via API do WhatsApp aparecerão aqui automaticamente.</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-2 items-center bg-white p-2 rounded-full shadow-sm border border-gray-200">
            <Input 
              placeholder="Digite uma mensagem..." 
              className="border-none focus-visible:ring-0 text-sm h-10" 
              disabled
            />
            <Button size="icon" className="rounded-full bg-[#128c7e] hover:bg-[#075e54] shrink-0">
              <Send size={18} />
            </Button>
          </div>
        </CardContent>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
          <Button 
            variant="outline" 
            className="gap-2 text-green-700 border-green-200 hover:bg-green-50"
            onClick={handleOpenWA}
          >
            <ExternalLink size={16} /> Abrir WhatsApp Web
          </Button>
        </div>
      </Card>
      
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <p className="text-xs text-amber-800">
          <strong>WhatsApp Business API:</strong> A integração oficial está pendente de configuração. 
          As mensagens enviadas pelo WhatsApp Web não são registradas automaticamente sem a API.
        </p>
      </div>
    </div>
  );
}

function CallsTab({ dealId }: { dealId: number }) {
  const { data: deal } = trpc.crm.getDeal.useQuery(dealId);
  
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-900">Fazer uma chamada</h3>
        <p className="text-sm text-gray-500">Escolha como você deseja entrar em contato com {deal?.contactName || "o cliente"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer group">
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video size={32} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Ligar no navegador</h4>
              <p className="text-xs text-gray-500 mt-1">Use seu microfone e alto-falante para ligar diretamente do CRM.</p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Iniciar chamada</Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer group">
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone size={32} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Transferir para telefone</h4>
              <p className="text-xs text-gray-500 mt-1">O sistema ligará para seu telefone e depois conectará ao cliente.</p>
            </div>
            <Button variant="outline" className="w-full">Transferir chamada</Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Phone size={18} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{deal?.phone || "Número não cadastrado"}</span>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-auto p-0 font-bold">
          Editar número
        </Button>
      </div>
    </div>
  );
}

function EmailsTab({ dealId }: { dealId: number }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="bg-white border border-gray-200">Entrada</Button>
          <Button variant="ghost" size="sm" className="text-gray-500">Enviados</Button>
          <Button variant="ghost" size="sm" className="text-gray-500">Rascunhos</Button>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={16} /> Escrever e-mail
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <Mail size={32} />
            </div>
            <p className="text-sm font-medium">Nenhum e-mail encontrado</p>
            <p className="text-xs text-center max-w-xs">Conecte sua conta de e-mail para sincronizar mensagens automaticamente com este negócio.</p>
            <Button variant="outline" size="sm" className="mt-2">Configurar E-mail</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductSection({ dealId }: { dealId: number }) {
  const { data: products, isLoading: productsLoading } = trpc.crm.listDealProducts.useQuery(dealId);
  const { data: allPhotos } = trpc.crm.listOpportunityPhotos.useQuery({ opportunityId: dealId });
  const utils = trpc.useUtils();

  const syncBlingMutation = trpc.crm.syncWithBling.useMutation({
    onSuccess: (data) => toast.success(data.message),
  });

  if (productsLoading) return <Loader2 className="animate-spin h-4 w-4 mx-auto my-4" />;

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">Produtos (ERP Bling)</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400"><Plus size={14} /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2"><Plus size={14} /> Cadastrar novo produto</DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => syncBlingMutation.mutate({ entity: 'products' })}>
              <History size={14} /> Sincronizar com Bling
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {products && products.length > 0 ? (
          products.map((product: any) => {
            const productPhotos = allPhotos?.filter(p => p.productId === product.id).slice(0, 4);
            
            return (
              <div key={product.dealProductId} className="space-y-2 pb-3 border-b border-gray-50 last:border-0 last:pb-0 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-blue-500" />
                    <span className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400">x{product.quantity}</span>
                    <Edit2 size={10} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-blue-500" />
                  </div>
                </div>
                
                {productPhotos && productPhotos.length > 0 && (
                  <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
                    {productPhotos.map((photo: any) => (
                      <div key={photo.id} className="w-10 h-10 rounded-md border border-gray-100 overflow-hidden bg-gray-50 shrink-0 cursor-pointer hover:border-blue-300 transition-colors">
                        <img src={photo.publicUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {allPhotos && allPhotos.filter(p => p.productId === product.id).length > 4 && (
                      <div className="w-10 h-10 rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 font-bold shrink-0">
                        +{allPhotos.filter(p => p.productId === product.id).length - 4}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-blue-600 font-bold">
                    R$ {parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {product.blingId && (
                    <Badge variant="outline" className="text-[8px] h-4 px-1 bg-orange-50 text-orange-600 border-orange-100 uppercase">Bling</Badge>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-6">
            <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-[10px] text-gray-400 italic">Nenhum produto vinculado ao negócio</p>
            <Button variant="link" className="text-xs text-blue-600 h-auto p-0 mt-2 font-bold">+ Vincular produto</Button>
          </div>
        )}
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
          <Button variant="ghost" className="text-[10px] text-gray-500 h-auto p-1 justify-start gap-2 hover:bg-gray-50">
            <Plus size={12} /> Adicionar parcelamento
          </Button>
          <Button variant="ghost" className="text-[10px] text-gray-500 h-auto p-1 justify-start gap-2 hover:bg-gray-50">
            <FileText size={12} /> Condições comerciais
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== MAIN PAGE ====================

export default function OpportunityDetails() {
  const [, params] = useRoute("/pipeline/:id");
  const [, setLocation] = useLocation();
  const dealId = params?.id ? parseInt(params.id) : null;
  const utils = trpc.useUtils();

  const { data: deal, isLoading, error } = trpc.crm.getDeal.useQuery(
    dealId as number,
    { enabled: !!dealId }
  );

  const { data: aiSummary, isLoading: summaryLoading } = trpc.crm.getAiSummary.useQuery(
    dealId as number,
    { enabled: !!dealId }
  );

  const generateAiMutation = trpc.crm.generateAiSummary.useMutation({
    onSuccess: () => {
      utils.crm.getAiSummary.invalidate(dealId as number);
      toast.success("Resumo gerado com IA!");
    },
  });

  const [activeTab, setActiveTab] = useState("anotacoes");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold">Negócio não encontrado</h2>
        <Button onClick={() => setLocation("/pipeline")}>Voltar para o Pipeline</Button>
      </div>
    );
  }

  const expectedValue = (parseFloat(deal.value) * (deal.probability / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="space-y-6 pb-10">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/pipeline")}
            className="rounded-full hover:bg-white"
          >
            <ChevronLeft size={24} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{deal.title}</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                {deal.status === 'open' ? 'Aberto' : deal.status === 'won' ? 'Ganho' : 'Perdido'}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {deal.companyName || "Sem empresa"} • {deal.contactName || "Sem contato"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => generateAiMutation.mutate(dealId as number)}
            disabled={generateAiMutation.isPending}
          >
            <Sparkles size={16} /> 
            {generateAiMutation.isPending ? "Resumindo..." : "Resumir com IA"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit2 size={16} /> Editar
          </Button>
          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 gap-2">
            <CheckCircle2 size={16} /> Ganho
          </Button>
          <Button variant="destructive" size="sm" className="gap-2">
            <X size={16} /> Perdido
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <MoreHorizontal size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2"><Archive size={14} /> Arquivar negócio</DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-red-600"><Trash2 size={14} /> Excluir negócio</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* AI Summary Banner */}
      {aiSummary && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardContent className="p-4 flex gap-4 items-start">
            <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                Resumo da Oportunidade por IA
                <span className="text-[10px] font-normal text-blue-500 uppercase tracking-widest">Geração 2026</span>
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">{aiSummary.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Esquerda (Detalhes) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">Detalhes do Projeto</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400"><Edit2 size={14} /></Button>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="group relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center justify-between">
                  Valor Total
                  <Edit2 size={10} className="opacity-0 group-hover:opacity-100 cursor-pointer text-blue-500" />
                </label>
                <p className="text-lg font-bold text-gray-900 mt-1">R$ {parseFloat(deal.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center justify-between">
                  Probabilidade
                  <Edit2 size={10} className="opacity-0 group-hover:opacity-100 cursor-pointer text-blue-500" />
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${deal.probability}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{deal.probability}%</span>
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Valor Esperado</label>
                <p className="text-sm font-bold text-blue-600 mt-1">R$ {expectedValue}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Calculado: Valor × Probabilidade</p>
              </div>

              <div className="group relative border-t border-gray-50 pt-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center justify-between">
                  Fechamento Esperado
                  <Edit2 size={10} className="opacity-0 group-hover:opacity-100 cursor-pointer text-blue-500" />
                </label>
                <p className="text-sm text-gray-700 mt-1 font-medium">
                  {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR') : "-"}
                </p>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center justify-between">
                  Responsável
                  <Edit2 size={10} className="opacity-0 group-hover:opacity-100 cursor-pointer text-blue-500" />
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold">DM</div>
                  <span className="text-sm text-gray-700">Diogo Martins</span>
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Origem</label>
                <p className="text-sm text-gray-700 mt-1">{deal.source || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-4 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">Pessoa</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {deal.contactName?.charAt(0) || "P"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">{deal.contactName || "N/A"}</p>
                  <p className="text-xs text-gray-500 truncate">{deal.email || "Sem e-mail"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{deal.phone || "Sem telefone"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <ProductSection dealId={dealId as number} />
        </div>

        {/* Área Principal (Tabs) */}
        <div className="lg:col-span-9">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-12 p-0 gap-6 overflow-x-auto no-scrollbar">
              <TabsTrigger value="anotacoes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <MessageSquare size={14} /> Anotações
              </TabsTrigger>
              <TabsTrigger value="atividades" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <Calendar size={14} /> Atividades
              </TabsTrigger>
              <TabsTrigger value="agendador" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <Clock size={14} /> Agendador
              </TabsTrigger>
              <TabsTrigger value="chamada" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <Phone size={14} /> Chamada
              </TabsTrigger>
              <TabsTrigger value="email" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <Mail size={14} /> E-mail
              </TabsTrigger>
              <TabsTrigger value="arquivos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <Files size={14} /> Arquivos
              </TabsTrigger>
              <TabsTrigger value="documentos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <FileText size={14} /> Documentos
              </TabsTrigger>
              <TabsTrigger value="fatura" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <Receipt size={14} /> Fatura
              </TabsTrigger>
              <TabsTrigger value="fotos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <Camera size={14} /> Fotos
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600 text-xs font-bold uppercase tracking-tight">
                <MessageCircle size={14} /> WhatsApp
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="anotacoes">
                <TimelineTab dealId={dealId as number} />
              </TabsContent>
              <TabsContent value="atividades">
                <ActivitiesTab dealId={dealId as number} />
              </TabsContent>
              <TabsContent value="chamada">
                <CallsTab dealId={dealId as number} />
              </TabsContent>
              <TabsContent value="email">
                <EmailsTab dealId={dealId as number} />
              </TabsContent>
              <TabsContent value="whatsapp">
                <WhatsAppTab dealId={dealId as number} />
              </TabsContent>
              <TabsContent value="fotos">
                <OpportunityPhotos opportunityId={dealId as number} />
              </TabsContent>
              
              {/* Placeholder para abas restantes */}
              {["agendador", "arquivos", "documentos", "fatura"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-xl bg-white text-gray-500">
                    Módulo de {tab.charAt(0).toUpperCase() + tab.slice(1)} em desenvolvimento (Pronto para Bling ERP)
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
