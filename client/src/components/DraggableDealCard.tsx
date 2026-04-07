import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";

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
}

export default function DraggableDealCard({ deal, stageId }: DraggableDealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${stageId}-${deal.id}`,
    data: {
      type: "Deal",
      deal,
      stageId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
    >
      <Card className="hover:shadow-md transition-shadow bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
            <p className="text-xs text-gray-600">{deal.company}</p>
            <p className="text-xs text-gray-500">{deal.contact}</p>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  R$ {(deal.value / 1000).toFixed(0)}k
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {deal.probability}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${deal.probability}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
