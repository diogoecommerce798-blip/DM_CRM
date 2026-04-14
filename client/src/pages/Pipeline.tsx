import { useState, useEffect } from "react";
import { Plus, DollarSign, TrendingUp, Loader2, PlusCircle, X } from "lucide-react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddDealModal from "@/components/AddDealModal";
import DroppableStage from "@/components/DroppableStage";
import DraggableDealCard from "@/components/DraggableDealCard";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Deal {
  id: number;
  title: string;
  value: number;
  company: string;
  contact: string;
  probability: number;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  deals: Deal[];
}

export default function Pipeline() {
  const utils = trpc.useUtils();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStageForNewDeal, setSelectedStageForNewDeal] = useState<string | null>(null);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<any>(null);

  const { data: dbStages, isLoading } = trpc.crm.listStages.useQuery();
  const { data: dbDeals } = trpc.crm.listDeals.useQuery();

  const createDealMutation = trpc.crm.createDeal.useMutation({
    onSuccess: () => {
      utils.crm.listDeals.invalidate();
      toast.success("Negócio criado!");
    },
  });

  const updateDealMutation = trpc.crm.updateDeal.useMutation({
    onSuccess: () => {
      utils.crm.listDeals.invalidate();
      toast.success("Negócio atualizado!");
    },
  });

  const deleteDealMutation = trpc.crm.deleteDeal.useMutation({
    onSuccess: () => {
      utils.crm.listDeals.invalidate();
      toast.success("Negócio excluído.");
    },
  });

  const [stages, setStages] = useState<Stage[]>([]);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [newStageName, setNewStageName] = useState("");

  const createStageMutation = trpc.crm.createStage.useMutation({
    onSuccess: () => {
      utils.crm.listStages.invalidate();
      setIsStageModalOpen(false);
      setNewStageName("");
      toast.success("Coluna adicionada!");
    },
  });

  const updateStageMutation = trpc.crm.updateStage.useMutation({
    onSuccess: () => {
      utils.crm.listStages.invalidate();
      setIsStageModalOpen(false);
      setEditingStage(null);
      setNewStageName("");
      toast.success("Coluna renomeada!");
    },
  });

  const deleteStageMutation = trpc.crm.deleteStage.useMutation({
    onSuccess: () => {
      utils.crm.listStages.invalidate();
      toast.success("Coluna removida!");
    },
  });

  // Configurar sensores para permitir cliques em botões dentro de áreas arrastáveis
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Só começa a arrastar se mover 8 pixels
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (dbStages && dbDeals) {
      const formattedStages: Stage[] = dbStages.map((s: any) => ({
        id: String(s.id),
        name: s.name,
        color: s.color || "bg-gray-100",
        deals: dbDeals
          .filter((d: any) => d.stageId === s.id)
          .map((d: any) => ({
            id: d.id,
            title: d.title,
            value: parseFloat(d.value) || 0,
            company: d.companyName || "N/A",
            contact: d.contactName || "N/A",
            probability: d.probability || 0,
          })),
      }));
      setStages(formattedStages);
    }
  }, [dbStages, dbDeals]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveDealId(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    setActiveDealId(null);

    const activeDealParts = activeId.split("-");
    const dealId = parseInt(activeDealParts[activeDealParts.length - 1]);
    
    let newStageId: number | null = null;
    if (overId.includes("-")) {
      const overParts = overId.split("-");
      newStageId = parseInt(overParts[0]);
    } else {
      newStageId = parseInt(overId);
    }

    if (!isNaN(dealId) && !isNaN(newStageId)) {
      updateDealMutation.mutate({ id: dealId, stageId: newStageId });
    }
  };

  const handleSaveDeal = (formData: any) => {
    if (editingDeal) {
      updateDealMutation.mutate({
        id: editingDeal.id,
        title: formData.title,
        value: String(formData.value || "0"),
        probability: parseInt(formData.probability || "0"),
        contactName: formData.contact,
        companyName: formData.organization,
        funnelId: formData.funnelId,
        source: formData.origin,
        visibility: formData.visibility === "Todos os usuários" ? "everyone" : (formData.visibility === "Apenas eu" ? "private" : "team"),
        tags: formData.tags,
        ownerId: parseInt(formData.ownerId) || 1,
        phone: formData.phone || undefined,
        phoneType: formData.phoneType || undefined,
        email: formData.email || undefined,
        emailType: formData.emailType || undefined,
        address: formData.address || undefined,
        potentialRating: formData.potentialRating || undefined,
        openingDate: formData.openingDate || undefined,
        companySize: formData.companySize || undefined,
        registrationStatus: formData.registrationStatus || undefined,
        cnpj: formData.cnpj || undefined,
        complement: formData.complement || undefined,
      });
    } else {
      // Se não houver um estágio selecionado (clique no botão do topo),
      // usamos o primeiro estágio disponível da lista carregada do banco.
      const defaultStageId = stages.length > 0 ? parseInt(stages[0].id) : 1;
      const finalStageId = selectedStageForNewDeal ? parseInt(selectedStageForNewDeal) : defaultStageId;

      createDealMutation.mutate({
        title: formData.title,
        value: String(formData.value || "0"),
        stageId: finalStageId,
        probability: parseInt(formData.probability || "0"),
        contactName: formData.contact,
        companyName: formData.organization,
        funnelId: formData.funnelId,
        source: formData.origin,
        visibility: formData.visibility === "Todos os usuários" ? "everyone" : (formData.visibility === "Apenas eu" ? "private" : "team"),
        tags: formData.tags,
        ownerId: parseInt(formData.ownerId) || 1,
        phone: formData.phone || undefined,
        phoneType: formData.phoneType || undefined,
        email: formData.email || undefined,
        emailType: formData.emailType || undefined,
        address: formData.address || undefined,
        potentialRating: formData.potentialRating || undefined,
        openingDate: formData.openingDate || undefined,
        companySize: formData.companySize || undefined,
        registrationStatus: formData.registrationStatus || undefined,
        cnpj: formData.cnpj || undefined,
        complement: formData.complement || undefined,
      });
    }
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const handleAddDeal = (stageId: string) => {
    if (stageId) {
      setSelectedStageForNewDeal(stageId);
      setEditingDeal(null);
      setIsModalOpen(true);
    }
  };

  const handleEditDeal = (deal: Deal) => {
    // Buscar os dados completos do deal do cache ou do banco se necessário
    // Por enquanto, usamos os dados que já temos no estado 'stages'
    const fullDealData = dbDeals?.find((d: any) => d.id === deal.id);
    
    setEditingDeal({
      id: deal.id,
      title: deal.title,
      value: deal.value,
      probability: deal.probability,
      contact: deal.contact,
      organization: deal.company,
      funnelId: fullDealData?.funnelId,
      origin: fullDealData?.source,
      visibility: fullDealData?.visibility,
      tags: fullDealData?.tags,
      phone: fullDealData?.phone,
      phoneType: fullDealData?.phoneType,
      email: fullDealData?.email,
      emailType: fullDealData?.emailType,
      address: fullDealData?.address,
      potentialRating: fullDealData?.potentialRating,
      openingDate: fullDealData?.openingDate,
      companySize: fullDealData?.companySize,
      registrationStatus: fullDealData?.registrationStatus,
      cnpj: fullDealData?.cnpj,
      complement: fullDealData?.complement,
    });
    setIsModalOpen(true);
  };

  const handleDeleteDeal = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este negócio?")) {
      deleteDealMutation.mutate(id);
    }
  };

  const handleCreateStage = () => {
    if (!newStageName.trim()) return;
    createStageMutation.mutate({
      pipelineId: 1, // Assumindo o pipeline padrão
      name: newStageName,
      order: stages.length + 1,
    });
  };

  const handleUpdateStage = () => {
    if (!editingStage || !newStageName.trim()) return;
    updateStageMutation.mutate({
      id: parseInt(editingStage.id),
      name: newStageName,
    });
  };

  const handleDeleteStage = (id: number) => {
    if (window.confirm("Tem certeza que deseja remover esta coluna? Todos os negócios nela também serão afetados.")) {
      deleteStageMutation.mutate(id);
    }
  };

  const openEditStageModal = (stage: Stage) => {
    setEditingStage(stage);
    setNewStageName(stage.name);
    setIsStageModalOpen(true);
  };

  // Calcular totais
  const totalValue = stages.reduce((sum, stage) => {
    return sum + stage.deals.reduce((stageSum, deal) => stageSum + deal.value, 0);
  }, 0);

  const totalDeals = stages.reduce((sum, stage) => sum + stage.deals.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Pipeline de Vendas</h2>
          <p className="text-gray-500 mt-1">Gerencie suas oportunidades - Arraste os cards para mover entre estágios</p>
        </div>
        <Button onClick={() => {
          setEditingDeal(null);
          setIsModalOpen(true);
        }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={20} className="mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total em Pipeline</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  R$ {(totalValue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Oportunidades</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalDeals}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Médio</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  R$ {totalDeals > 0 ? (totalValue / totalDeals / 1000).toFixed(1) : "0"}k
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => {
          setActiveDealId(String(event.active.id));
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4 items-start">
          {stages.map((stage) => (
            <DroppableStage
              key={stage.id}
              stage={stage}
              onAddDeal={handleAddDeal}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
              onEditStage={openEditStageModal}
              onDeleteStage={handleDeleteStage}
            />
          ))}
          
          <Button
            onClick={() => {
              setEditingStage(null);
              setNewStageName("");
              setIsStageModalOpen(true);
            }}
            variant="ghost"
            className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all gap-2"
          >
            <PlusCircle size={32} />
            <span className="font-medium">Nova Coluna</span>
          </Button>
        </div>

        {/* Drag Overlay - mostra o card sendo arrastado */}
        <DragOverlay>
          {activeDealId && (
            <div className="opacity-80">
              <DraggableDealCard 
                deal={stages.flatMap(s => s.deals).find(d => String(d.id) === activeDealId.split("-").pop())!} 
                stageId={activeDealId.split("-")[0]} 
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal Negócio */}
      <AddDealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStageForNewDeal(null);
          setEditingDeal(null);
        }}
        onSave={handleSaveDeal}
        initialData={editingDeal}
      />

      {/* Modal Coluna (Stage) */}
      <Dialog open={isStageModalOpen} onOpenChange={setIsStageModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStage ? "Renomear Coluna" : "Nova Coluna"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Coluna</Label>
              <Input
                id="name"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="Ex: Em Negociação"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStageModalOpen(false)}>Cancelar</Button>
            <Button onClick={editingStage ? handleUpdateStage : handleCreateStage}>
              {editingStage ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
