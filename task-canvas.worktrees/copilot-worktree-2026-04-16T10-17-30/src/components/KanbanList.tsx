import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { List as ListType, Card } from '@/types/kanban';
import KanbanCard from './KanbanCard';

interface KanbanListProps {
  list: ListType;
  index: number;
  onUpdateTitle: (listId: string, title: string) => void;
  onDeleteList: (listId: string) => void;
  onAddCard: (listId: string, title: string) => void;
  onCardClick: (card: Card, listId: string) => void;
  searchQuery: string;
  filterLabels: string[];
  filterMembers: string[];
  filterDueDate: string | null;
}

export default function KanbanList({
  list, index, onUpdateTitle, onDeleteList, onAddCard, onCardClick,
  searchQuery, filterLabels, filterMembers, filterDueDate,
}: KanbanListProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const addCardRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showAddCard && addCardRef.current) addCardRef.current.focus();
  }, [showAddCard]);

  const handleTitleSave = () => {
    if (title.trim()) onUpdateTitle(list.id, title.trim());
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(list.id, newCardTitle.trim());
      setNewCardTitle('');
    }
  };

  const filteredCards = list.cards.filter(card => {
    if (card.archived) return false;
    if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterLabels.length > 0 && !card.labels.some(l => filterLabels.includes(l.id))) return false;
    if (filterMembers.length > 0 && !card.members.some(m => filterMembers.includes(m.id))) return false;
    if (filterDueDate) {
      if (!card.dueDate) return false;
      if (filterDueDate === 'overdue' && new Date(card.dueDate) >= new Date()) return false;
      if (filterDueDate === 'upcoming' && (new Date(card.dueDate) < new Date() || new Date(card.dueDate) > new Date(Date.now() + 7 * 86400000))) return false;
    }
    return true;
  });

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-72 shrink-0 flex flex-col bg-trello-list-bg rounded-xl max-h-[calc(100vh-8rem)] shadow-sm"
        >
          {/* Header */}
          <div {...provided.dragHandleProps} className="flex items-center justify-between px-3 pt-3 pb-1">
            {isEditingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={e => e.key === 'Enter' && handleTitleSave()}
                className="flex-1 px-1.5 py-0.5 text-sm font-semibold rounded border border-primary bg-background text-foreground"
              />
            ) : (
              <h3
                onClick={() => setIsEditingTitle(true)}
                className="flex-1 text-sm font-semibold text-foreground cursor-pointer px-1.5 py-0.5"
              >
                {list.title}
              </h3>
            )}
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded hover:bg-black/10">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-popover rounded-lg shadow-lg border z-50 py-1">
                    <button
                      onClick={() => { onDeleteList(list.id); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-sm text-destructive hover:bg-accent"
                    >
                      Delete list
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cards */}
          <Droppable droppableId={list.id} type="card">
            {(droppableProvided, snapshot) => (
              <div
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className={`flex-1 overflow-y-auto px-2 py-1 space-y-2 min-h-[4px] ${snapshot.isDraggingOver ? 'bg-black/5 rounded-lg' : ''}`}
              >
                {filteredCards.map((card, cardIndex) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    index={cardIndex}
                    onClick={() => onCardClick(card, list.id)}
                  />
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Card */}
          <div className="p-2">
            {showAddCard ? (
              <div className="space-y-2">
                <textarea
                  ref={addCardRef}
                  value={newCardTitle}
                  onChange={e => setNewCardTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(); }
                    if (e.key === 'Escape') { setShowAddCard(false); setNewCardTitle(''); }
                  }}
                  placeholder="Enter a title for this card..."
                  className="w-full px-2 py-1.5 text-sm rounded-lg border shadow-sm resize-none bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                />
                <div className="flex items-center gap-1">
                  <button onClick={handleAddCard} className="px-3 py-1.5 rounded text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
                    Add card
                  </button>
                  <button onClick={() => { setShowAddCard(false); setNewCardTitle(''); }} className="p-1.5 rounded hover:bg-black/10">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCard(true)}
                className="w-full flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-black/5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add a card
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
