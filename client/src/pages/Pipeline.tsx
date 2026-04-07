import { useState } from "react";
import { Plus, DollarSign, TrendingUp } from "lucide-react";
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
import AddDealModal from "@/components/AddDealModal";
import DroppableStage from "@/components/DroppableStage";
import DraggableDealCard from "@/components/DraggableDealCard";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStageForNewDeal, setSelectedStageForNewDeal] = useState<string | null>(null);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);

  // State para gerenciar os stages e deals
  const [stages, setStages] = useState<Stage[]>([
    {
      id: "prospecting",
      name: "Prospecção",
      color: "bg-gray-100",
      deals: [
        { id: 1, title: "Contato Inicial", value: 15000, company: "Empresa A", contact: "João Silva", probability: 20 },
        { id: 2, title: "Follow-up", value: 22000, company: "Empresa B", contact: "Maria Santos", probability: 20 },
      ],
    },
    {
      id: "qualification",
      name: "Qualificação",
      color: "bg-blue-50",
      deals: [
        { id: 3, title: "Reunião Agendada", value: 35000, company: "Empresa C", contact: "Carlos Oliveira", probability: 40 },
      ],
    },
    {
      id: "proposal",
      name: "Proposta",
      color: "bg-purple-50",
      deals: [
        { id: 4, title: "Proposta Enviada", value: 45000, company: "Empresa D", contact: "Ana Costa", probability: 60 },
        { id: 5, title: "Apresentação", value: 28000, company: "Empresa E", contact: "Pedro Ferreira", probability: 60 },
      ],
    },
    {
      id: "negotiation",
      name: "Negociação",
      color: "bg-yellow-50",
      deals: [
        { id: 6, title: "Discussão de Preço", value: 52000, company: "Empresa F", contact: "Lucia Martins", probability: 80 },
      ],
    },
    {
      id: "closed",
      name: "Fechado",
      color: "bg-green-50",
      deals: [
        { id: 7, title: "Contrato Assinado", value: 65000, company: "Empresa G", contact: "Roberto Silva", probability: 100 },
      ],
    },
  ]);

  // Configurar sensores para drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calcular totais
  const totalValue = stages.reduce((sum, stage) => {
    return sum + stage.deals.reduce((stageSum, deal) => stageSum + deal.value, 0);
  }, 0);

  const totalDeals = stages.reduce((sum, stage) => sum + stage.deals.length, 0);

  // Encontrar um deal por ID
  const findDealById = (dealId: string): { deal: Deal; stageId: string } | null => {
    for (const stage of stages) {
      const deal = stage.deals.find((d) => `${stage.id}-${d.id}` === dealId);
      if (deal) {
        return { deal, stageId: stage.id };
      }
    }
    return null;
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDealId(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    setActiveDealId(null);

    // Se o item foi solto em um estágio vazio
    if (typeof overId === "string" && !overId.includes("-")) {
      const activeDeal = findDealById(activeId);
      if (activeDeal) {
        const { deal, stageId: oldStageId } = activeDeal;

        if (oldStageId !== overId) {
          // Remover do estágio antigo
          setStages((prevStages) =>
            prevStages.map((stage) =>
              stage.id === oldStageId
                ? { ...stage, deals: stage.deals.filter((d) => d.id !== deal.id) }
                : stage
            )
          );

          // Adicionar ao novo estágio
          setStages((prevStages) =>
            prevStages.map((stage) =>
              stage.id === overId ? { ...stage, deals: [...stage.deals, deal] } : stage
            )
          );
        }
      }
      return;
    }

    // Se o item foi solto em outro item
    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "Deal" && overData?.type === "Deal") {
      const activeDeal = findDealById(activeId);
      const overDeal = findDealById(overId);

      if (activeDeal && overDeal) {
        const { deal: activeDealData, stageId: activeStageId } = activeDeal;
        const { stageId: overStageId } = overDeal;

        if (activeStageId === overStageId) {
          // Reordenar dentro do mesmo estágio
          setStages((prevStages) =>
            prevStages.map((stage) => {
              if (stage.id === activeStageId) {
                const oldIndex = stage.deals.findIndex((d) => d.id === activeDealData.id);
                const newIndex = stage.deals.findIndex((d) => d.id === overDeal.deal.id);
                return {
                  ...stage,
                  deals: arrayMove(stage.deals, oldIndex, newIndex),
                };
              }
              return stage;
            })
          );
        } else {
          // Mover para outro estágio
          setStages((prevStages) =>
            prevStages.map((stage) => {
              if (stage.id === activeStageId) {
                return {
                  ...stage,
                  deals: stage.deals.filter((d) => d.id !== activeDealData.id),
                };
              }
              if (stage.id === overStageId) {
                const newIndex = stage.deals.findIndex((d) => d.id === overDeal.deal.id);
                return {
                  ...stage,
                  deals: [
                    ...stage.deals.slice(0, newIndex + 1),
                    activeDealData,
                    ...stage.deals.slice(newIndex + 1),
                  ],
                };
              }
              return stage;
            })
          );
        }
      }
    }
  };

  const handleAddDeal = (stageId: string) => {
    if (stageId) {
      setSelectedStageForNewDeal(stageId);
      setIsModalOpen(true);
    }
  };

  const handleSaveDeal = (deal: any) => {
    const stageId = selectedStageForNewDeal || "prospecting";
    const newDeal: Deal = {
      id: Math.max(...stages.flatMap((s) => s.deals.map((d) => d.id)), 0) + 1,
      title: deal.title || "Novo Negócio",
      value: parseInt(deal.value) || 0,
      company: deal.organization || "N/A",
      contact: deal.contact || "N/A",
      probability: parseInt(deal.probability) || 0,
    };

    setStages((prevStages) =>
      prevStages.map((stage) =>
        stage.id === stageId
          ? { ...stage, deals: [...stage.deals, newDeal] }
          : stage
      )
    );
    setIsModalOpen(false);
    setSelectedStageForNewDeal(null);
  };

  // Encontrar o deal que está sendo arrastado para mostrar no overlay
  const activeDeal = activeDealId ? findDealById(activeDealId) : null;
  const activeDealData = activeDeal?.deal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Pipeline de Vendas</h2>
          <p className="text-gray-500 mt-1">Gerencie suas oportunidades - Arraste os cards para mover entre estágios</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                  R$ {(totalValue / totalDeals / 1000).toFixed(1)}k
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <DroppableStage
              key={stage.id}
              stage={stage}
              onAddDeal={handleAddDeal}
            />
          ))}
        </div>

        {/* Drag Overlay - mostra o card sendo arrastado */}
        <DragOverlay>
          {activeDealData && activeDeal && (
          <DraggableDealCard deal={activeDealData} stageId={activeDeal.stageId} />
        )}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      <AddDealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStageForNewDeal(null);
        }}
        onSave={(deal) => {
          if (selectedStageForNewDeal) {
            handleSaveDeal(deal);
          }
        }}
      />
    </div>
  );
}
