import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/types/kanban';
import { Clock, CheckSquare } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface KanbanCardProps {
  card: Card;
  index: number;
  onClick: () => void;
}

export default function KanbanCard({ card, index, onClick }: KanbanCardProps) {
  const totalItems = card.checklists.reduce((sum, cl) => sum + cl.items.length, 0);
  const completedItems = card.checklists.reduce((sum, cl) => sum + cl.items.filter(i => i.completed).length, 0);
  const isOverdue = card.dueDate && isPast(new Date(card.dueDate)) && !isToday(new Date(card.dueDate));
  const isDueToday = card.dueDate && isToday(new Date(card.dueDate));

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-card rounded-lg shadow-sm border border-border cursor-pointer hover:ring-2 hover:ring-primary/40 transition-shadow ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}`}
        >
          {card.coverColor && (
            <div className="h-8 rounded-t-lg" style={{ background: card.coverColor }} />
          )}
          <div className="p-2 space-y-1.5">
            {card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {card.labels.map(label => (
                  <span
                    key={label.id}
                    className="inline-block h-2 w-10 rounded-full"
                    style={{ background: `hsl(${label.color.replace('var(--', '').replace(')', '')})` }}
                    title={label.name}
                  />
                ))}
              </div>
            )}
            <p className="text-sm text-card-foreground">{card.title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {card.dueDate && (
                <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${isOverdue ? 'bg-destructive/15 text-destructive' : isDueToday ? 'bg-yellow-100 text-yellow-700' : 'text-muted-foreground'}`}>
                  <Clock className="w-3 h-3" />
                  {format(new Date(card.dueDate), 'MMM d')}
                </span>
              )}
              {card.description && <span className="text-xs text-muted-foreground">📝</span>}
              {totalItems > 0 && (
                <span className={`flex items-center gap-1 text-xs ${completedItems === totalItems ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <CheckSquare className="w-3 h-3" /> {completedItems}/{totalItems}
                </span>
              )}
              {card.members.length > 0 && (
                <div className="flex -space-x-1 ml-auto">
                  {card.members.slice(0, 3).map(m => (
                    <div
                      key={m.id}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ring-2 ring-card"
                      style={{ backgroundColor: m.color }}
                      title={m.name}
                    >
                      {m.initials}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
