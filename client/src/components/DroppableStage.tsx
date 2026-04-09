import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Edit2, Trash2 } from "lucide-react";
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
  onEditStage?: (stage: Stage) => void;
  onDeleteStage?: (id: number) => void;
}

export default function DroppableStage({ 
  stage, 
  onAddDeal, 
  onEditDeal, 
  onDeleteDeal,
  onEditStage,
  onDeleteStage
}: DroppableStageProps) {
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
      <div className="mb-4 flex items-center justify-between group">
        <div>
          <h3 className="font-semibold text-gray-900">{stage.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {stage.deals.length} oportunidade{stage.deals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEditStage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-blue-600"
              onClick={() => onEditStage(stage)}
            >
              <Edit2 size={14} />
            </Button>
          )}
          {onDeleteStage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-600"
              onClick={() => onDeleteStage(parseInt(stage.id))}
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
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
