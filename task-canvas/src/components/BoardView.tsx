import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Plus, X, Star, MoreHorizontal } from 'lucide-react';
import KanbanList from '@/components/KanbanList';
import CardDetail from '@/components/CardDetail';
import FilterBar from '@/components/FilterBar';
import { Board, Card } from '@/types/kanban';

interface BoardViewProps {
  board: Board;
  onAddList: (title: string) => void;
  onUpdateList: (listId: string, title: string) => void;
  onDeleteList: (listId: string) => void;
  onAddCard: (listId: string, title: string) => void;
  onUpdateCard: (listId: string, card: Card) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
  onMoveCard: (sourceListId: string, destListId: string, sourceIndex: number, destIndex: number) => void;
  onReorderLists: (sourceIndex: number, destIndex: number) => void;
  onToggleStar: (boardId: string) => void;
  searchQuery: string;
}

export default function BoardView({
  board, onAddList, onUpdateList, onDeleteList, onAddCard, onUpdateCard, onDeleteCard,
  onMoveCard, onReorderLists, onToggleStar, searchQuery,
}: BoardViewProps) {
  const [filterLabels, setFilterLabels] = useState<string[]>([]);
  const [filterMembers, setFilterMembers] = useState<string[]>([]);
  const [filterDueDate, setFilterDueDate] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<{ card: Card; listId: string } | null>(null);
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'list') {
      onReorderLists(source.index, destination.index);
    } else {
      onMoveCard(source.droppableId, destination.droppableId, source.index, destination.index);
    }
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      onAddList(newListTitle.trim());
      setNewListTitle('');
      setShowAddList(false);
    }
  };

  const selectedListTitle = selectedCard ? board.lists.find(l => l.id === selectedCard.listId)?.title || '' : '';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Board toolbar */}
      <div className="h-12 flex items-center px-4 gap-3 shrink-0" style={{ background: board.background }}>
        <h1 className="text-lg font-bold text-white truncate">{board.title}</h1>
        <button onClick={() => onToggleStar(board.id)} className="p-1 rounded hover:bg-white/20">
          <Star className={`w-4 h-4 ${board.starred ? 'text-yellow-400 fill-yellow-400' : 'text-white/70'}`} />
        </button>
        <div className="flex-1" />
        <FilterBar
          filterLabels={filterLabels} setFilterLabels={setFilterLabels}
          filterMembers={filterMembers} setFilterMembers={setFilterMembers}
          filterDueDate={filterDueDate} setFilterDueDate={setFilterDueDate}
        />
        <button className="p-1.5 rounded text-white/80 hover:bg-white/20">
          <MoreHorizontal className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Board content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4" style={{ background: board.background }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex gap-3 items-start h-full">
                {board.lists.map((list, index) => (
                  <KanbanList
                    key={list.id}
                    list={list}
                    index={index}
                    onUpdateTitle={onUpdateList}
                    onDeleteList={onDeleteList}
                    onAddCard={onAddCard}
                    onCardClick={(card, listId) => setSelectedCard({ card, listId })}
                    searchQuery={searchQuery}
                    filterLabels={filterLabels}
                    filterMembers={filterMembers}
                    filterDueDate={filterDueDate}
                  />
                ))}
                {provided.placeholder}

                <div className="w-72 shrink-0">
                  {showAddList ? (
                    <div className="bg-trello-list-bg rounded-xl p-2 space-y-2">
                      <input autoFocus value={newListTitle} onChange={e => setNewListTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddList(); if (e.key === 'Escape') { setShowAddList(false); setNewListTitle(''); } }}
                        placeholder="Enter list title..." className="w-full px-2 py-1.5 text-sm rounded border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                      <div className="flex items-center gap-1">
                        <button onClick={handleAddList} className="px-3 py-1.5 rounded text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">Add list</button>
                        <button onClick={() => { setShowAddList(false); setNewListTitle(''); }} className="p-1.5 rounded hover:bg-black/10"><X className="w-4 h-4 text-muted-foreground" /></button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddList(true)} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-white/90 bg-white/20 hover:bg-white/30 transition-colors">
                      <Plus className="w-4 h-4" /> Add another list
                    </button>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {selectedCard && (
        <CardDetail
          card={selectedCard.card}
          listId={selectedCard.listId}
          listTitle={selectedListTitle}
          onUpdate={onUpdateCard}
          onDelete={onDeleteCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
