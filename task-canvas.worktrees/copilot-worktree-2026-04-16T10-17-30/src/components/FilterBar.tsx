import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Label, Member } from '@/types/kanban';

interface FilterBarProps {
  filterLabels: string[];
  setFilterLabels: (labels: string[]) => void;
  filterMembers: string[];
  setFilterMembers: (members: string[]) => void;
  filterDueDate: string | null;
  setFilterDueDate: (d: string | null) => void;
  availableLabels: Label[];
  availableMembers: Member[];
}

export default function FilterBar({ filterLabels, setFilterLabels, filterMembers, setFilterMembers, filterDueDate, setFilterDueDate, availableLabels, availableMembers }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilters = filterLabels.length > 0 || filterMembers.length > 0 || filterDueDate !== null;

  const toggleLabel = (id: string) => {
    setFilterLabels(filterLabels.includes(id) ? filterLabels.filter(l => l !== id) : [...filterLabels, id]);
  };
  const toggleMember = (id: string) => {
    setFilterMembers(filterMembers.includes(id) ? filterMembers.filter(m => m !== id) : [...filterMembers, id]);
  };
  const clearAll = () => {
    setFilterLabels([]);
    setFilterMembers([]);
    setFilterDueDate(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${hasFilters ? 'bg-white/40 text-white' : 'bg-white/20 text-white/90 hover:bg-white/30'}`}
      >
        <Filter className="w-4 h-4" /> Filter {hasFilters && `(${filterLabels.length + filterMembers.length + (filterDueDate ? 1 : 0)})`}
      </button>
      {showFilters && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowFilters(false)} />
          <div className="absolute top-full left-0 mt-1 w-72 bg-popover rounded-lg shadow-lg border z-50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Filters</span>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Labels</p>
              <div className="space-y-1">
                {availableLabels.map(l => (
                  <button key={l.id} onClick={() => toggleLabel(l.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm hover:bg-accent ${filterLabels.includes(l.id) ? 'ring-2 ring-ring' : ''}`}>
                    <span className="w-6 h-4 rounded" style={{ background: `hsl(${l.color.replace('var(--', '').replace(')', '')})` }} />
                    <span className="text-foreground">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Members</p>
              <div className="space-y-1">
                {availableMembers.map(m => (
                  <button key={m.id} onClick={() => toggleMember(m.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm hover:bg-accent ${filterMembers.includes(m.id) ? 'ring-2 ring-ring' : ''}`}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: m.color }}>{m.initials}</div>
                    <span className="text-foreground">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Due Date</p>
              <div className="flex gap-1">
                {['overdue', 'upcoming'].map(opt => (
                  <button key={opt} onClick={() => setFilterDueDate(filterDueDate === opt ? null : opt)}
                    className={`px-2 py-1 rounded text-xs capitalize ${filterDueDate === opt ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground hover:opacity-80'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
