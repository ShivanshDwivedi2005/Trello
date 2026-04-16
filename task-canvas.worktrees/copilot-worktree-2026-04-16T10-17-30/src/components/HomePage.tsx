import { Clock, CheckSquare, Plus, Eye } from 'lucide-react';
import { Board } from '@/types/kanban';

interface HomePageProps {
  boards: Board[];
  onOpenBoard: (id: string) => void;
  onCreateBoard: (title: string, bg: string) => void;
}

export default function HomePage({ boards, onOpenBoard, onCreateBoard }: HomePageProps) {
  const recentBoards = [...boards]
    .filter(b => b.recentlyViewed)
    .sort((a, b) => (b.recentlyViewed || '').localeCompare(a.recentlyViewed || ''))
    .slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Your Items */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Your Items</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              When you're added to a checklist item, it'll show up here.
            </p>
          </div>

          {/* Up next */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Up next</h3>
            </div>

            <div className="flex items-start gap-4 mb-6 p-4 rounded-lg bg-card border border-border">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                <CheckSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Up next</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Keep track of upcoming due dates, mentions, and tasks.
                </p>
                <button className="px-3 py-1.5 rounded text-sm font-medium bg-muted hover:bg-muted/70 text-muted-foreground transition-colors">
                  Got it! Dismiss this.
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 shrink-0 hidden lg:block">
          {/* Recently viewed */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recently viewed</h3>
            </div>
            <div className="space-y-2">
              {recentBoards.map(board => (
                <button
                  key={board.id}
                  onClick={() => onOpenBoard(board.id)}
                  className="w-full flex items-center gap-3 rounded-md px-1 py-1.5 hover:bg-accent transition-colors text-left"
                >
                  <div className="w-8 h-6 rounded shrink-0" style={{ background: board.background }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{board.title}</p>
                    <p className="text-xs text-muted-foreground truncate">Trello Workspace</p>
                  </div>
                </button>
              ))}
              {recentBoards.length === 0 && (
                <p className="text-xs text-muted-foreground">No recently viewed boards</p>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Links</h3>
            <button
              onClick={() => onCreateBoard('New Board', 'hsl(214 72% 48%)')}
              className="flex items-center gap-2 text-sm text-foreground hover:bg-accent rounded-md px-1 py-1.5 w-full transition-colors"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
              Create new board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
