import { useState } from 'react';
import { Star, Clock, LayoutDashboard, Users, Settings } from 'lucide-react';
import { Board, Workspace, BOARD_BACKGROUNDS } from '@/types/kanban';
import TrelloMark from '@/components/TrelloMark';

type Page = 'home' | 'boards' | 'members' | 'settings' | 'board' | 'templates';

interface HomeBoardsPageProps {
  boards: Board[];
  workspace: Workspace;
  onOpenBoard: (id: string) => void;
  onCreateBoard: (title: string, bg: string) => void;
  onToggleStar: (id: string) => void;
  onNavigate: (page: Page) => void;
}

export default function HomeBoardsPage({ boards, workspace, onOpenBoard, onCreateBoard, onToggleStar, onNavigate }: HomeBoardsPageProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBg, setNewBg] = useState('linear-gradient(135deg, #8b6adf 0%, #d56cb8 100%)');

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
    <div className="flex-1 overflow-y-auto bg-[#0b0c0f]">
      <div className="max-w-[1360px] mx-auto px-8 sm:px-10 lg:px-14 py-14">
        {starredBoards.length > 0 && (
          <Section icon={<Star className="w-[11px] h-[11px]" />} title="Starred boards">
            <BoardGrid boards={starredBoards} onOpenBoard={onOpenBoard} onToggleStar={onToggleStar} />
          </Section>
        )}

        {recentBoards.length > 0 && (
          <Section icon={<Clock className="w-[11px] h-[11px]" />} title="Recently viewed">
            <BoardGrid boards={recentBoards} onOpenBoard={onOpenBoard} onToggleStar={onToggleStar} />
          </Section>
        )}

        <div className="mb-8 pt-6">
          <h2 className="text-[18px] font-semibold text-[#9fadbc] uppercase tracking-tight mb-6">YOUR WORKSPACES</h2>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[6px] bg-gradient-to-b from-[#4bce97] to-[#216e4e] flex items-center justify-center">
              <TrelloMark className="w-[13px] h-[13px] bg-transparent" glyphClassName="w-[7px] h-[7px]" />
            </div>
            <span className="text-[18px] font-semibold text-[#dcdfe4]">{workspace.name}</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-6 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {boards.map(board => (
                <BoardTile key={board.id} board={board} onOpen={() => onOpenBoard(board.id)} onToggleStar={() => onToggleStar(board.id)} />
              ))}
              {showCreate ? (
                <div className="rounded-xl bg-[#2c2b30] border border-black/20 p-4 space-y-3 min-h-[136px]">
                  <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder="Board title" className="w-full px-3 py-2 text-sm border border-[#454f59] rounded-md bg-[#22272b] text-[#dcdfe4] focus:outline-none focus:ring-2 focus:ring-[#579dff]" />
                  <div className="flex gap-1">
                    {BOARD_BACKGROUNDS.slice(0, 6).map(bg => (
                      <button key={bg} onClick={() => setNewBg(bg)} className={`w-6 h-5 rounded ${newBg === bg ? 'ring-2 ring-ring ring-offset-1' : ''}`} style={{ background: bg }} />
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={handleCreate} className="px-3 py-1.5 rounded text-xs font-medium bg-[#579dff] text-[#1d2125]">Create</button>
                    <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 rounded text-xs text-[#9fadbc] hover:bg-white/5">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowCreate(true)}
                  className="rounded-xl bg-[#2c2b30] hover:bg-[#36353b] border border-black/20 transition-colors flex items-center justify-center text-[18px] text-[#9fadbc] min-h-[136px]">
                  Create new board
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap xl:justify-end">
              <button onClick={() => onNavigate('boards')} className="flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-semibold bg-[#2c2b30] hover:bg-[#36353b] text-[#dcdfe4] transition-colors">
                <LayoutDashboard className="w-[8px] h-[8px]" /> Boards
              </button>
              <button onClick={() => onNavigate('members')} className="flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-semibold bg-[#2c2b30] hover:bg-[#36353b] text-[#dcdfe4] transition-colors">
                <Users className="w-[8px] h-[8px]" /> Members
              </button>
              <button onClick={() => onNavigate('settings')} className="flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-semibold bg-[#2c2b30] hover:bg-[#36353b] text-[#dcdfe4] transition-colors">
                <Settings className="w-[8px] h-[8px]" /> Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[#dcdfe4]">{icon}</span>
        <h2 className="text-[18px] font-semibold text-[#dcdfe4]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function BoardGrid({ boards, onOpenBoard, onToggleStar }: { boards: Board[]; onOpenBoard: (id: string) => void; onToggleStar: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
      className="group rounded-xl overflow-hidden cursor-pointer bg-[#15171b] border border-black/20 hover:brightness-110 transition-all min-h-[136px] max-w-[276px] w-full"
    >
      <div className="relative h-[90px]" style={{ background: board.background }}>
        <button
          onClick={e => { e.stopPropagation(); onToggleStar(); }}
          className={`absolute top-10 right-3 flex items-center justify-center w-6 h-6 rounded-[8px] bg-black/20 transition-opacity ${board.starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <Star className={`w-[9px] h-[9px] ${board.starred ? 'text-white fill-white' : 'text-white/80 hover:text-white'}`} />
        </button>
      </div>
      <div className="px-3 py-3">
        <span className="text-[16px] font-medium text-[#dcdfe4]">{board.title}</span>
      </div>
    </div>
  );
}
