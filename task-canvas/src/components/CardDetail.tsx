import { useState } from 'react';
import { X, Calendar, Tag, Users, CheckSquare, Trash2, AlignLeft, Plus } from 'lucide-react';
import { Card, Label, Member, Checklist, ChecklistItem } from '@/types/kanban';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

interface CardDetailProps {
  card: Card;
  listId: string;
  listTitle: string;
  onUpdate: (listId: string, card: Card) => void;
  onDelete: (listId: string, cardId: string) => void;
  onClose: () => void;
  availableLabels: Label[];
  availableMembers: Member[];
}

export default function CardDetail({ card, listId, listTitle, onUpdate, onDelete, onClose, availableLabels, availableMembers }: CardDetailProps) {
  const [editCard, setEditCard] = useState<Card>({ ...card });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});

  const save = (updated: Card) => {
    setEditCard(updated);
    onUpdate(listId, updated);
  };

  const toggleLabel = (label: Label) => {
    const has = editCard.labels.find(l => l.id === label.id);
    save({ ...editCard, labels: has ? editCard.labels.filter(l => l.id !== label.id) : [...editCard.labels, label] });
  };

  const toggleMember = (member: Member) => {
    const has = editCard.members.find(m => m.id === member.id);
    save({ ...editCard, members: has ? editCard.members.filter(m => m.id !== member.id) : [...editCard.members, member] });
  };

  const addChecklist = () => {
    if (newChecklistTitle.trim()) {
      save({ ...editCard, checklists: [...editCard.checklists, { id: uuidv4(), title: newChecklistTitle.trim(), items: [] }] });
      setNewChecklistTitle('');
      setShowAddChecklist(false);
    }
  };

  const addChecklistItem = (clId: string) => {
    const text = newItemTexts[clId]?.trim();
    if (!text) return;
    save({
      ...editCard,
      checklists: editCard.checklists.map(cl =>
        cl.id === clId ? { ...cl, items: [...cl.items, { id: uuidv4(), text, completed: false }] } : cl
      ),
    });
    setNewItemTexts(prev => ({ ...prev, [clId]: '' }));
  };

  const toggleCheckItem = (clId: string, itemId: string) => {
    save({
      ...editCard,
      checklists: editCard.checklists.map(cl =>
        cl.id === clId ? {
          ...cl, items: cl.items.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i)
        } : cl
      ),
    });
  };

  const deleteCheckItem = (clId: string, itemId: string) => {
    save({
      ...editCard,
      checklists: editCard.checklists.map(cl =>
        cl.id === clId ? { ...cl, items: cl.items.filter(i => i.id !== itemId) } : cl
      ),
    });
  };

  const deleteChecklist = (clId: string) => {
    save({ ...editCard, checklists: editCard.checklists.filter(cl => cl.id !== clId) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-trello-list-bg rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50">
        {/* Cover */}
        {editCard.coverColor && <div className="h-24 rounded-t-xl" style={{ background: editCard.coverColor }} />}

        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Title */}
          {isEditingTitle ? (
            <input
              autoFocus
              value={editCard.title}
              onChange={e => setEditCard({ ...editCard, title: e.target.value })}
              onBlur={() => { save(editCard); setIsEditingTitle(false); }}
              onKeyDown={e => e.key === 'Enter' && (save(editCard), setIsEditingTitle(false))}
              className="text-xl font-semibold w-full px-2 py-1 rounded border border-primary bg-background text-foreground"
            />
          ) : (
            <h2 onClick={() => setIsEditingTitle(true)} className="text-xl font-semibold text-foreground cursor-pointer hover:bg-black/5 px-2 py-1 rounded -ml-2">
              {editCard.title}
            </h2>
          )}
          <p className="text-xs text-muted-foreground mt-1 ml-1">in list <span className="font-medium underline">{listTitle}</span></p>

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            {/* Main content */}
            <div className="flex-1 space-y-6">
              {/* Labels & Members & Due Date badges */}
              <div className="flex flex-wrap gap-4">
                {editCard.labels.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Labels</p>
                    <div className="flex gap-1 flex-wrap">
                      {editCard.labels.map(l => (
                        <span key={l.id} className="px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ background: `hsl(${l.color.replace('var(--', '').replace(')', '')})` }}>
                          {l.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {editCard.members.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Members</p>
                    <div className="flex -space-x-1">
                      {editCard.members.map(m => (
                        <div key={m.id} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ring-2 ring-trello-list-bg"
                          style={{ backgroundColor: m.color }} title={m.name}>
                          {m.initials}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {editCard.dueDate && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Due date</p>
                    <span className="text-sm text-foreground">{format(new Date(editCard.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlignLeft className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">Description</p>
                </div>
                {isEditingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      autoFocus
                      value={editCard.description}
                      onChange={e => setEditCard({ ...editCard, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => { save(editCard); setIsEditingDesc(false); }} className="px-3 py-1 rounded text-sm font-medium bg-primary text-primary-foreground">Save</button>
                      <button onClick={() => setIsEditingDesc(false)} className="px-3 py-1 rounded text-sm text-muted-foreground hover:bg-accent">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditingDesc(true)}
                    className="min-h-[60px] px-3 py-2 text-sm text-foreground bg-black/5 rounded cursor-pointer hover:bg-black/10"
                  >
                    {editCard.description || <span className="text-muted-foreground">Add a more detailed description...</span>}
                  </div>
                )}
              </div>

              {/* Checklists */}
              {editCard.checklists.map(cl => {
                const done = cl.items.filter(i => i.completed).length;
                const total = cl.items.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={cl.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-semibold text-foreground">{cl.title}</p>
                      </div>
                      <button onClick={() => deleteChecklist(cl.id)} className="text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded hover:bg-accent">Delete</button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground w-6">{pct}%</span>
                      <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1 ml-6">
                      {cl.items.map(item => (
                        <div key={item.id} className="flex items-center gap-2 group">
                          <input type="checkbox" checked={item.completed} onChange={() => toggleCheckItem(cl.id, item.id)} className="accent-primary" />
                          <span className={`text-sm flex-1 ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.text}</span>
                          <button onClick={() => deleteCheckItem(cl.id, item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-1 mt-1">
                        <input
                          value={newItemTexts[cl.id] || ''}
                          onChange={e => setNewItemTexts(prev => ({ ...prev, [cl.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && addChecklistItem(cl.id)}
                          placeholder="Add an item"
                          className="flex-1 px-2 py-1 text-sm rounded border bg-background text-foreground"
                        />
                        <button onClick={() => addChecklistItem(cl.id)} className="px-2 py-1 rounded text-sm bg-primary text-primary-foreground">Add</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar actions */}
            <div className="w-44 space-y-2 shrink-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add to card</p>

              {/* Labels */}
              <div className="relative">
                <button onClick={() => setShowLabelPicker(!showLabelPicker)} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-accent text-accent-foreground hover:opacity-80">
                  <Tag className="w-4 h-4" /> Labels
                </button>
                {showLabelPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLabelPicker(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-popover rounded-lg shadow-lg border z-50 p-3 space-y-1">
                      {availableLabels.map(label => (
                        <button key={label.id} onClick={() => toggleLabel(label)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left hover:bg-accent ${editCard.labels.find(l => l.id === label.id) ? 'ring-2 ring-ring' : ''}`}>
                          <span className="w-8 h-5 rounded" style={{ background: `hsl(${label.color.replace('var(--', '').replace(')', '')})` }} />
                          <span className="text-foreground">{label.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Members */}
              <div className="relative">
                <button onClick={() => setShowMemberPicker(!showMemberPicker)} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-accent text-accent-foreground hover:opacity-80">
                  <Users className="w-4 h-4" /> Members
                </button>
                {showMemberPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMemberPicker(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-popover rounded-lg shadow-lg border z-50 p-3 space-y-1">
                      {availableMembers.map(member => (
                        <button key={member.id} onClick={() => toggleMember(member)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left hover:bg-accent ${editCard.members.find(m => m.id === member.id) ? 'ring-2 ring-ring' : ''}`}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: member.color }}>{member.initials}</div>
                          <span className="text-foreground">{member.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Due Date */}
              <div className="relative">
                <button onClick={() => setShowDatePicker(!showDatePicker)} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-accent text-accent-foreground hover:opacity-80">
                  <Calendar className="w-4 h-4" /> Due Date
                </button>
                {showDatePicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-popover rounded-lg shadow-lg border z-50 p-3">
                      <input
                        type="date"
                        value={editCard.dueDate || ''}
                        onChange={e => save({ ...editCard, dueDate: e.target.value || null })}
                        className="w-full px-2 py-1.5 text-sm rounded border bg-background text-foreground"
                      />
                      {editCard.dueDate && (
                        <button onClick={() => save({ ...editCard, dueDate: null })} className="mt-2 text-xs text-destructive hover:underline">Remove due date</button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Checklist */}
              <div className="relative">
                <button onClick={() => setShowAddChecklist(!showAddChecklist)} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-accent text-accent-foreground hover:opacity-80">
                  <CheckSquare className="w-4 h-4" /> Checklist
                </button>
                {showAddChecklist && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAddChecklist(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-popover rounded-lg shadow-lg border z-50 p-3 space-y-2">
                      <input
                        autoFocus
                        value={newChecklistTitle}
                        onChange={e => setNewChecklistTitle(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addChecklist()}
                        placeholder="Checklist title"
                        className="w-full px-2 py-1.5 text-sm rounded border bg-background text-foreground"
                      />
                      <button onClick={addChecklist} className="w-full py-1.5 rounded text-sm font-medium bg-primary text-primary-foreground">Add</button>
                    </div>
                  </>
                )}
              </div>

              {/* Cover */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mt-4 mb-1">Cover</p>
                <div className="flex flex-wrap gap-1">
                  {['hsl(214 80% 52%)', 'hsl(145 63% 42%)', 'hsl(0 72% 51%)', 'hsl(270 50% 55%)', 'hsl(28 87% 56%)', 'hsl(43 96% 56%)'].map(c => (
                    <button key={c} onClick={() => save({ ...editCard, coverColor: editCard.coverColor === c ? null : c })}
                      className={`w-8 h-6 rounded ${editCard.coverColor === c ? 'ring-2 ring-ring ring-offset-1' : ''}`} style={{ background: c }} />
                  ))}
                </div>
              </div>

              <hr className="border-border my-2" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</p>
              <button onClick={() => save({ ...editCard, archived: true })} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-accent text-accent-foreground hover:opacity-80">
                Archive
              </button>
              <button onClick={() => { onDelete(listId, card.id); onClose(); }} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-destructive/10 text-destructive hover:bg-destructive/20">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
