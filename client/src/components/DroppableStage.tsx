import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DraggableDealCard from "./DraggableDealCard";

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

interface DroppableStageProps {
  stage: Stage;
  onAddDeal: (stageId: string) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (id: number) => void;
}

export default function DroppableStage({ stage, onAddDeal, onEditDeal, onDeleteDeal }: DroppableStageProps) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
    data: {
      type: "Stage",
      stage,
    },
  });

  const dealIds = stage.deals.map((deal) => `${stage.id}-${deal.id}`);

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {stage.deals.length} oportunidade{stage.deals.length !== 1 ? "s" : ""}
        </p>
      </div>

      <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`${stage.color} rounded-lg p-4 space-y-3 flex-1 min-h-[500px] overflow-y-auto`}
        >
          {stage.deals.map((deal) => (
            <DraggableDealCard 
              key={deal.id} 
              deal={deal} 
              stageId={stage.id} 
              onEdit={onEditDeal}
              onDelete={onDeleteDeal}
            />
          ))}

          <Button
            onClick={() => onAddDeal(stage.id)}
            variant="outline"
            className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900"
          >
            <Plus size={16} className="mr-2" />
            Adicionar
          </Button>
        </div>
      </SortableContext>
    </div>
  );
}
