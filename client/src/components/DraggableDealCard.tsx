import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Deal {
  id: number;
  title: string;
  value: number;
  company: string;
  contact: string;
  probability: number;
}

interface DraggableDealCardProps {
  deal: Deal;
  stageId: string;
  onEdit?: (deal: Deal) => void;
  onDelete?: (id: number) => void;
}

export default function DraggableDealCard({ deal, stageId, onEdit, onDelete }: DraggableDealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${stageId}-${deal.id}`,
    data: {
      type: "Deal",
      deal,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group relative"
    >
      <CardContent className="p-3" {...attributes} {...listeners}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm text-gray-900 pr-8">{deal.title}</h4>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-600 pointer-events-auto"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(deal);
                }}
              >
                <Edit2 size={14} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-600 pointer-events-auto"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(deal.id);
                }}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-500">{deal.company}</p>
          <p className="text-xs text-gray-400">{deal.contact}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-sm text-gray-900">
            R$ {(deal.value / 1000).toFixed(0)}k
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
            {deal.probability}%
          </span>
        </div>

        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all" 
            style={{ width: `${deal.probability}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}
