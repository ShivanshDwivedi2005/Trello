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
          className={`bg-[#1f1635] rounded-3xl border border-white/10 shadow-lg cursor-pointer transition-transform ${snapshot.isDragging ? 'scale-[1.01] shadow-2xl' : 'hover:-translate-y-0.5 hover:shadow-xl'}`}
        >
          {card.coverColor && (
            <div className="h-9 rounded-t-3xl" style={{ background: card.coverColor }} />
          )}
          <div className="p-3 space-y-2">
            {card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {card.labels.map(label => (
                  <span
                    key={label.id}
                    className="inline-flex h-2.5 px-2 rounded-full"
                    style={{ background: label.color }}
                    title={label.name}
                  />
                ))}
              </div>
            )}
            <p className="text-sm font-medium text-white leading-5">{card.title}</p>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {card.dueDate && (
                <span className={`flex items-center gap-1 rounded-full px-2 py-1 ${isOverdue ? 'bg-red-500/15 text-red-200' : isDueToday ? 'bg-amber-500/15 text-amber-200' : 'bg-white/10 text-slate-200'}`}>
                  <Clock className="w-3 h-3" />
                  {format(new Date(card.dueDate), 'MMM d')}
                </span>
              )}
              {totalItems > 0 && (
                <span className={`flex items-center gap-1 rounded-full px-2 py-1 ${completedItems === totalItems ? 'bg-emerald-500/15 text-emerald-200' : 'bg-white/10 text-slate-200'}`}>
                  <CheckSquare className="w-3 h-3" /> {completedItems}/{totalItems}
                </span>
              )}
              {card.members.length > 0 && (
                <div className="flex -space-x-1 ml-auto">
                  {card.members.slice(0, 3).map(m => (
                    <div
                      key={m.id}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ring-2 ring-white"
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
