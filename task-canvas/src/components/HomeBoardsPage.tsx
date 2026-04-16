import { useState } from 'react';
import { Star, Clock, LayoutDashboard, Plus, Users, Settings } from 'lucide-react';
import { Board, Workspace, BOARD_BACKGROUNDS } from '@/types/kanban';

type Page = 'home' | 'boards' | 'members' | 'settings' | 'board' | 'templates';

interface HomeBoardsPageProps {
  boards: Board[];
  workspace: Workspace;
  onOpenBoard: (id: string) => void;
  onCreateBoard: (title: string, bg: string) => void;
  onToggleStar: (id: string) => void;
  onNavigate: (page: Page) => void;
  pageType: 'home' | 'boards';
}

export default function HomeBoardsPage({ boards, workspace, onOpenBoard, onCreateBoard, onToggleStar, onNavigate, pageType }: HomeBoardsPageProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBg, setNewBg] = useState(BOARD_BACKGROUNDS[0]);

  const starredBoards = boards.filter(b => b.starred);
  const recentBoards = [...boards].filter(b => b.recentlyViewed).sort((a, b) => (b.recentlyViewed || '').localeCompare(a.recentlyViewed || '')).slice(0, 4);

  const handleCreate = () => {
    if (newTitle.trim()) {
      onCreateBoard(newTitle.trim(), newBg);
      setNewTitle('');
      setShowCreate(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-8">
        {/* Starred boards */}
        {starredBoards.length > 0 && (
          <Section icon={<Star className="w-5 h-5" />} title="Starred boards">
            <BoardGrid boards={starredBoards} onOpenBoard={onOpenBoard} onToggleStar={onToggleStar} />
          </Section>
        )}

        {/* Recently viewed */}
        {recentBoards.length > 0 && (
          <Section icon={<Clock className="w-5 h-5" />} title="Recently viewed">
            <BoardGrid boards={recentBoards} onOpenBoard={onOpenBoard} onToggleStar={onToggleStar} />
          </Section>
        )}

        {/* YOUR WORKSPACES */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">YOUR WORKSPACES</h2>

          {/* Workspace row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-foreground">{workspace.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => onNavigate('boards')} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-secondary hover:bg-secondary/70 text-secondary-foreground transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" /> Boards
              </button>
              <button onClick={() => onNavigate('members')} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-secondary hover:bg-secondary/70 text-secondary-foreground transition-colors">
                <Users className="w-3.5 h-3.5" /> Members
              </button>
              <button onClick={() => onNavigate('settings')} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-secondary hover:bg-secondary/70 text-secondary-foreground transition-colors">
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
            </div>
          </div>

          {/* Board tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {boards.map(board => (
              <BoardTile key={board.id} board={board} onOpen={() => onOpenBoard(board.id)} onToggleStar={() => onToggleStar(board.id)} />
            ))}
            {/* Create new board tile */}
            {showCreate ? (
              <div className="rounded-lg bg-secondary p-3 space-y-2">
                <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="Board title" className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <div className="flex gap-1">
                  {BOARD_BACKGROUNDS.slice(0, 6).map(bg => (
                    <button key={bg} onClick={() => setNewBg(bg)} className={`w-6 h-5 rounded ${newBg === bg ? 'ring-2 ring-ring ring-offset-1' : ''}`} style={{ background: bg }} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={handleCreate} className="px-2.5 py-1 rounded text-xs font-medium bg-primary text-primary-foreground">Create</button>
                  <button onClick={() => setShowCreate(false)} className="px-2.5 py-1 rounded text-xs text-muted-foreground hover:bg-accent">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowCreate(true)}
                className="rounded-lg bg-secondary hover:bg-secondary/70 transition-colors flex items-center justify-center gap-1.5 text-sm text-muted-foreground h-[120px]">
                Create new board
              </button>
            )}
          </div>

          {/* View closed boards */}
          <button className="mt-4 text-sm text-muted-foreground hover:underline">
            View all closed boards
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-foreground">{icon}</span>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function BoardGrid({ boards, onOpenBoard, onToggleStar }: { boards: Board[]; onOpenBoard: (id: string) => void; onToggleStar: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {boards.map(board => (
        <BoardTile key={board.id} board={board} onOpen={() => onOpenBoard(board.id)} onToggleStar={() => onToggleStar(board.id)} />
      ))}
    </div>
  );
}

function BoardTile({ board, onOpen, onToggleStar }: { board: Board; onOpen: () => void; onToggleStar: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group rounded-lg overflow-hidden cursor-pointer bg-card hover:opacity-90 transition-opacity"
    >
      {/* Gradient area */}
      <div className="relative h-20" style={{ background: board.background }}>
        <button
          onClick={e => { e.stopPropagation(); onToggleStar(); }}
          className={`absolute top-2 right-2 transition-opacity ${board.starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <Star className={`w-4 h-4 ${board.starred ? 'text-yellow-400 fill-yellow-400' : 'text-white/70 hover:text-yellow-400'}`} />
        </button>
      </div>
      {/* Title below */}
      <div className="px-3 py-2">
        <span className="text-sm font-medium text-foreground">{board.title}</span>
      </div>
    </div>
  );
}
