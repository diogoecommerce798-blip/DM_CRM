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
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import OpportunityPhotos from "@/components/OpportunityPhotos";
import { useState, useMemo } from "react";

function ProductSection({ dealId }: { dealId: number }) {
  const { data: products, isLoading: productsLoading } = trpc.crm.listDealProducts.useQuery(dealId);
  const { data: allPhotos } = trpc.crm.listOpportunityPhotos.useQuery({ opportunityId: dealId });

  if (productsLoading) return <Loader2 className="animate-spin h-4 w-4" />;

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">Produto</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400"><Plus size={14} /></Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {products && products.length > 0 ? (
          products.map((product: any) => {
            const productPhotos = allPhotos?.filter(p => p.productId === product.id).slice(0, 3);
            
            return (
              <div key={product.dealProductId} className="space-y-2 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-blue-500" />
                    <span className="text-sm font-bold text-gray-900">{product.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">x{product.quantity}</span>
                </div>
                
                {/* Mini thumbnails of photos linked to this product */}
                {productPhotos && productPhotos.length > 0 && (
                  <div className="flex gap-1.5">
                    {productPhotos.map((photo: any) => (
                      <div key={photo.id} className="w-8 h-8 rounded border border-gray-100 overflow-hidden bg-gray-50">
                        <img src={photo.publicUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {allPhotos && allPhotos.filter(p => p.productId === product.id).length > 3 && (
                      <div className="w-8 h-8 rounded border border-gray-100 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                        +{allPhotos.filter(p => p.productId === product.id).length - 3}
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-blue-600 font-semibold">
                  R$ {parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )
          })
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-gray-400 italic">Nenhum produto vinculado</p>
            <Button variant="link" className="text-xs text-blue-600 h-auto p-0 mt-2">+ Adicionar produto</Button>
          </div>
        )}
        <div className="pt-2 border-t border-gray-100">
          <Button variant="link" className="text-xs text-gray-500 h-auto p-0 flex items-center gap-1">
            <Plus size={12} /> Adicionar parcelamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OpportunityDetails() {
  const [, params] = useRoute("/pipeline/:id");
  const [, setLocation] = useLocation();
  const dealId = params?.id ? parseInt(params.id) : null;

  const { data: deal, isLoading, error } = trpc.crm.getDeal.useQuery(
    dealId as number,
    { enabled: !!dealId }
  );

  const [activeTab, setActiveTab] = useState("fotos");

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
                {deal.status === 'open' ? 'Aberto' : deal.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {deal.companyName || "Sem empresa"} • {deal.contactName || "Sem contato"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit2 size={16} /> Editar
          </Button>
          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 gap-2">
            <CheckCircle2 size={16} /> Ganho
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <MoreHorizontal size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Esquerda (Detalhes) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">Detalhes</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400"><Edit2 size={14} /></Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Valor</label>
                <p className="text-lg font-bold text-gray-900">R$ {parseFloat(deal.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Probabilidade</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${deal.probability}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{deal.probability}%</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Origem</label>
                <p className="text-sm text-gray-700 mt-1">{deal.source || "-"}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Fechamento Esperado</label>
                <p className="text-sm text-gray-700 mt-1">
                  {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR') : "-"}
                </p>
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
            <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-12 p-0 gap-8">
              <TabsTrigger value="anotacoes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <MessageSquare size={16} /> Anotações
              </TabsTrigger>
              <TabsTrigger value="atividades" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <Calendar size={16} /> Atividades
              </TabsTrigger>
              <TabsTrigger value="agendador" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <Clock size={16} /> Agendador
              </TabsTrigger>
              <TabsTrigger value="chamada" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <Phone size={16} /> Chamada
              </TabsTrigger>
              <TabsTrigger value="email" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <Mail size={16} /> E-mail
              </TabsTrigger>
              <TabsTrigger value="arquivos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <Files size={16} /> Arquivos
              </TabsTrigger>
              <TabsTrigger value="fotos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <Camera size={16} /> Fotos
              </TabsTrigger>
              <TabsTrigger value="documentos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <FileText size={16} /> Documentos
              </TabsTrigger>
              <TabsTrigger value="fatura" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 gap-2 text-gray-500 data-[state=active]:text-blue-600">
                <Receipt size={16} /> Fatura
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="fotos">
                <OpportunityPhotos opportunityId={dealId as number} />
              </TabsContent>
              <TabsContent value="anotacoes">
                <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-xl bg-white text-gray-500">
                  Módulo de Anotações em desenvolvimento
                </div>
              </TabsContent>
              {/* Fallback para outras abas */}
              {["atividades", "agendador", "chamada", "email", "arquivos", "documentos", "fatura"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-xl bg-white text-gray-500">
                    Conteúdo da aba {tab.charAt(0).toUpperCase() + tab.slice(1)} em desenvolvimento
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
