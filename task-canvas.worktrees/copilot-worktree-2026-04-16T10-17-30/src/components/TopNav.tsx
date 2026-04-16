import { useState } from 'react';
import { Bell, Grid2x2, Megaphone, Search } from 'lucide-react';
import { BOARD_BACKGROUNDS } from '@/types/kanban';
import TrelloWordmark from '@/components/TrelloWordmark';

interface TopNavProps {
  onCreateBoard: (title: string, bg: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onGoHome: () => void;
  currentUser: { initials: string; name: string; color: string };
}

export default function TopNav({ onCreateBoard, searchQuery, onSearchChange, onGoHome, currentUser }: TopNavProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBg, setNewBg] = useState(BOARD_BACKGROUNDS[0]);

  const close = () => setShowCreate(false);

  const handleCreate = () => {
    if (newTitle.trim()) {
      onCreateBoard(newTitle.trim(), newBg);
      setNewTitle('');
      setShowCreate(false);
    }
  };

  return (
    <header className="h-12 bg-[#0b0c0f] flex items-center px-2 shrink-0 relative z-50 border-b border-white/5">
      <div className="h-8 w-full flex items-center justify-between gap-2">
      <button className="w-8 h-8 rounded-[3px] hover:bg-white/6 text-[#9fadbc] transition-colors flex items-center justify-center shrink-0">
        <Grid2x2 className="w-3.5 h-3.5" />
      </button>

      <button onClick={onGoHome} className="h-8 px-1 rounded-[3px] hover:bg-white/6 transition-colors shrink-0 flex items-center">
        <TrelloWordmark className="w-[70px] h-6" />
      </button>

      <div className="flex-1 flex justify-center min-w-0 px-1">
        <div className="relative w-full max-w-[780px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9fadbc]" />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search"
            className="w-full h-[30px] pl-10 pr-4 rounded-[3px] text-[14px] bg-[#16181d] border border-[#343a40] text-[#b6c2cf] placeholder:text-[#9fadbc] focus:outline-none focus:ring-2 focus:ring-[#579dff] focus:border-[#579dff] transition-all"
          />
        </div>
      </div>

      <div className="relative shrink-0">
        <button onClick={() => setShowCreate(!showCreate)} className="h-8 px-4 rounded-[3px] text-[14px] font-medium bg-[#579dff] text-[#1d2125] hover:bg-[#85b8ff] transition-colors">
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

      <div className="flex items-center gap-1 shrink-0 pl-1">
        <button className="w-8 h-8 rounded-[3px] hover:bg-white/6 text-[#9fadbc] transition-colors flex items-center justify-center">
          <Megaphone className="w-3.5 h-3.5" />
        </button>
        <button className="w-8 h-8 rounded-[3px] hover:bg-white/6 text-[#9fadbc] transition-colors relative flex items-center justify-center">
          <Bell className="w-3.5 h-3.5" />
        </button>
        <button className="w-8 h-8 rounded-[3px] hover:bg-white/6 text-[#9fadbc] transition-colors flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.1 9.3a3 3 0 1 1 5.5 2c-.8 1.2-1.9 1.8-2.4 2.7-.2.4-.2.6-.2 1" />
            <circle cx="12" cy="17.3" r=".6" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold text-white shrink-0 ml-1" style={{ backgroundColor: currentUser.color }} title={currentUser.name}>
          {currentUser.initials}
        </button>
      </div>
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
