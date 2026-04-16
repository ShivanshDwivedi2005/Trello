import { useState } from 'react';
import { Home, LayoutDashboard, Users, Settings, CreditCard, ChevronDown, ChevronUp, FileText, Plus } from 'lucide-react';
import { Workspace } from '@/types/kanban';

type Page = 'home' | 'boards' | 'members' | 'settings' | 'board' | 'templates';

interface WorkspaceSidebarProps {
  workspace: Workspace;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function WorkspaceSidebar({ workspace, activePage, onNavigate }: WorkspaceSidebarProps) {
  const [wsExpanded, setWsExpanded] = useState(true);

  return (
    <aside className="w-[260px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col overflow-y-auto">
      {/* Top nav: Boards, Templates, Home */}
      <nav className="px-3 pt-3 pb-1 space-y-0.5">
        <SidebarButton
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="Boards"
          active={activePage === 'boards'}
          onClick={() => onNavigate('boards')}
        />
        <SidebarButton
          icon={<FileText className="w-4 h-4" />}
          label="Templates"
          active={activePage === 'templates'}
          onClick={() => onNavigate('templates')}
        />
        <SidebarButton
          icon={<Home className="w-4 h-4" />}
          label="Home"
          active={activePage === 'home'}
          onClick={() => onNavigate('home')}
        />
      </nav>

      <div className="h-px bg-sidebar-border mx-3 my-2" />

      {/* Workspaces header */}
      <div className="px-3">
        <p className="text-[11px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-2.5 mb-1.5">Workspaces</p>

        {/* Workspace toggle */}
        <button
          onClick={() => setWsExpanded(!wsExpanded)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
        >
          <div className="w-7 h-7 rounded bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground flex-1 text-left truncate">{workspace.name}</span>
          {wsExpanded ? <ChevronUp className="w-3.5 h-3.5 text-sidebar-foreground/50 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground/50 shrink-0" />}
        </button>

        {/* Workspace sub-items */}
        {wsExpanded && (
          <div className="ml-4 pl-3 border-l border-sidebar-border space-y-0.5 mt-0.5 mb-2">
            <SidebarButton
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Boards"
              active={activePage === 'board'}
              onClick={() => onNavigate('boards')}
            />
            <div className="flex items-center">
              <SidebarButton
                icon={<Users className="w-4 h-4" />}
                label="Members"
                active={activePage === 'members'}
                onClick={() => onNavigate('members')}
                className="flex-1"
              />
              <button className="p-1 rounded hover:bg-sidebar-accent/50 text-sidebar-foreground/50 hover:text-sidebar-foreground shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <SidebarButton
              icon={<Settings className="w-4 h-4" />}
              label="Settings"
              active={activePage === 'settings'}
              onClick={() => onNavigate('settings')}
            />
            <SidebarButton
              icon={<CreditCard className="w-4 h-4" />}
              label="Billing"
              active={false}
              onClick={() => {}}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarButton({ icon, label, active, onClick, className = '' }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
        active
          ? 'bg-primary/20 text-primary font-semibold'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      } ${className}`}
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </button>
  );
}
