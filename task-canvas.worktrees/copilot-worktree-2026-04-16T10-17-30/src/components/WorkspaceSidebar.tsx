import { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, CreditCard, LayoutDashboard, Plus, Settings, SquarePlus, Users } from 'lucide-react';
import { Workspace } from '@/types/kanban';
import TrelloMark from '@/components/TrelloMark';

type Page = 'home' | 'boards' | 'members' | 'settings' | 'board' | 'templates';

interface WorkspaceSidebarProps {
  workspace: Workspace;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function WorkspaceSidebar({ workspace, activePage, onNavigate }: WorkspaceSidebarProps) {
  const [wsExpanded, setWsExpanded] = useState(true);

  return (
    <aside className="w-[360px] shrink-0 bg-[#0b0c0f] flex flex-col overflow-y-auto">
      <nav className="px-8 pt-12 pb-1 space-y-2">
        <SidebarButton
          icon={<LayoutDashboard className="w-[9px] h-[9px]" />}
          label="Boards"
          active={activePage === 'boards'}
          onClick={() => onNavigate('boards')}
        />
        <SidebarButton
          icon={<SquarePlus className="w-[9px] h-[9px]" />}
          label="Templates"
          active={activePage === 'templates'}
          onClick={() => onNavigate('templates')}
        />
        <SidebarButton
          icon={<Activity className="w-[9px] h-[9px]" />}
          label="Home"
          active={activePage === 'home'}
          onClick={() => onNavigate('home')}
        />
      </nav>

      <div className="h-px bg-white/8 mx-8 my-4" />

      <div className="px-8">
        <p className="text-[13px] font-semibold text-[#9fadbc] px-3 mb-3">Workspaces</p>

        <button
          onClick={() => setWsExpanded(!wsExpanded)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/6 transition-colors"
        >
          <div className="w-8 h-8 rounded-[6px] bg-gradient-to-b from-[#4bce97] to-[#216e4e] flex items-center justify-center shrink-0">
            <TrelloMark className="w-[12px] h-[12px] bg-transparent" glyphClassName="w-[7px] h-[7px]" />
          </div>
          <span className="text-[15px] font-semibold text-[#dcdfe4] flex-1 text-left truncate">{workspace.name}</span>
          {wsExpanded ? <ChevronUp className="w-[9px] h-[9px] text-[#9fadbc] shrink-0" /> : <ChevronDown className="w-[9px] h-[9px] text-[#9fadbc] shrink-0" />}
        </button>

        {wsExpanded && (
          <div className="ml-8 pl-2 space-y-2 mt-3 mb-2">
            <SidebarButton
              icon={<LayoutDashboard className="w-[9px] h-[9px]" />}
              label="Boards"
              active={activePage === 'board' || activePage === 'boards'}
              onClick={() => onNavigate('boards')}
            />
            <div className="flex items-center">
              <SidebarButton
                icon={<Users className="w-[9px] h-[9px]" />}
                label="Members"
                active={activePage === 'members'}
                onClick={() => onNavigate('members')}
                className="flex-1"
              />
              <button className="p-1.5 rounded-md hover:bg-white/6 text-[#9fadbc] hover:text-[#dcdfe4] shrink-0">
                <Plus className="w-[8px] h-[8px]" />
              </button>
            </div>
            <SidebarButton
              icon={<Settings className="w-[9px] h-[9px]" />}
              label="Settings"
              active={activePage === 'settings'}
              onClick={() => onNavigate('settings')}
            />
            <SidebarButton
              icon={<CreditCard className="w-[9px] h-[9px]" />}
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-colors ${
        active
          ? 'bg-[#1c2b41] text-[#579dff] font-semibold'
          : 'text-[#dcdfe4] hover:bg-white/6'
      } ${className}`}
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </button>
  );
}
