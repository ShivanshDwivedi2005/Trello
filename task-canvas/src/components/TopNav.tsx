import { useState } from 'react';
import { Search, Plus, Bell, HelpCircle, ChevronDown, Star, LayoutTemplate, Grid3X3 } from 'lucide-react';
import { Board, BOARD_BACKGROUNDS } from '@/types/kanban';

interface TopNavProps {
  boards: Board[];
  onOpenBoard: (id: string) => void;
  onCreateBoard: (title: string, bg: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onGoHome: () => void;
  currentUser: { initials: string; name: string; color: string };
}

export default function TopNav({ boards, onOpenBoard, onCreateBoard, searchQuery, onSearchChange, onGoHome, currentUser }: TopNavProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBg, setNewBg] = useState(BOARD_BACKGROUNDS[0]);

  const recentBoards = [...boards].filter(b => b.recentlyViewed).sort((a, b) => (b.recentlyViewed || '').localeCompare(a.recentlyViewed || '')).slice(0, 4);
  const starredBoards = boards.filter(b => b.starred);

  const toggle = (menu: string) => setActiveMenu(activeMenu === menu ? null : menu);
  const close = () => { setActiveMenu(null); setShowCreate(false); };

  const handleCreate = () => {
    if (newTitle.trim()) {
      onCreateBoard(newTitle.trim(), newBg);
      setNewTitle('');
      setShowCreate(false);
    }
  };

  return (
    <header className="h-12 bg-trello-nav flex items-center px-2 sm:px-4 gap-1 shrink-0 relative z-50 border-b border-border/30">
      {/* App switcher */}
      <button className="p-2 rounded hover:bg-sidebar-accent/40 text-trello-nav-foreground">
        <Grid3X3 className="w-4 h-4" />
      </button>

      {/* Logo */}
      <button onClick={onGoHome} className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-sidebar-accent/40 transition-colors">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
            <rect x="3" y="3" width="7" height="17" rx="1.5" />
            <rect x="14" y="3" width="7" height="10" rx="1.5" />
          </svg>
        </div>
        <span className="text-trello-nav-foreground font-bold text-lg tracking-tight hidden sm:block">Trello</span>
      </button>

      <div className="flex-1" />

      {/* Search - centered */}
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search"
          className="w-full pl-9 pr-3 py-1.5 rounded-md text-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all"
        />
      </div>

      {/* Create button */}
      <div className="relative ml-2">
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1 px-4 py-1.5 rounded-sm text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
          Create
        </button>
        {showCreate && (
          <Dropdown onClose={close} className="w-80 right-0 left-auto">
            <p className="text-sm font-semibold text-foreground px-3 pt-2 pb-1">Create board</p>
            <div className="px-3 pb-3 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Background</p>
                <div className="flex gap-1.5 flex-wrap">
                  {BOARD_BACKGROUNDS.map(bg => (
                    <button key={bg} onClick={() => setNewBg(bg)} className={`w-10 h-8 rounded ${newBg === bg ? 'ring-2 ring-ring ring-offset-1' : ''}`} style={{ background: bg }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Board title <span className="text-destructive">*</span></label>
                <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  className="w-full mt-1 px-2.5 py-1.5 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button onClick={handleCreate} disabled={!newTitle.trim()}
                className="w-full py-2 rounded text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                Create
              </button>
            </div>
          </Dropdown>
        )}
      </div>

      <div className="flex-1" />

      {/* Right icons */}
      <div className="flex items-center gap-0.5">
        <button className="p-2 rounded hover:bg-sidebar-accent/40 text-trello-nav-foreground">
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button className="p-2 rounded hover:bg-sidebar-accent/40 text-trello-nav-foreground relative">
          <Bell className="w-4.5 h-4.5" />
        </button>
        <button className="p-2 rounded hover:bg-sidebar-accent/40 text-trello-nav-foreground hidden sm:block">
          <HelpCircle className="w-4.5 h-4.5" />
        </button>
        <button className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ml-1" style={{ backgroundColor: currentUser.color }} title={currentUser.name}>
          {currentUser.initials}
        </button>
      </div>
    </header>
  );
}

function Dropdown({ children, onClose, className = '' }: { children: React.ReactNode; onClose: () => void; className?: string }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className={`absolute left-0 top-full mt-1 bg-popover rounded-lg shadow-xl border z-50 py-1 min-w-[260px] ${className}`}>
        {children}
      </div>
    </>
  );
}
