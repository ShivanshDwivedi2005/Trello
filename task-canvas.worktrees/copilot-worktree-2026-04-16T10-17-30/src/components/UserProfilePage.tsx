import React, { useState } from 'react';
import { Board, Workspace } from '@/types/kanban';
import { Star } from 'lucide-react';

interface UserProfilePageProps {
  currentUser: { id: string; name: string; initials: string; color: string; avatar?: string };
  boards: Board[];
  workspace: Workspace;
  onOpenBoard: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export default function UserProfilePage({ currentUser, boards, workspace, onOpenBoard, onToggleStar }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'cards' | 'settings' | 'boards'>('boards');

  // Typically user boards shows all their boards in one grid or grouped by workspace. We'll group by workspace.
  // We mock a username handle 
  const usernameHandle = `@${currentUser.name.replace(/\s+/g, '').toLowerCase()}`;

  const tabs = [
    { id: 'profile', label: 'Profile and visibility' },
    { id: 'activity', label: 'Activity' },
    { id: 'cards', label: 'Cards' },
    { id: 'settings', label: 'Settings' },
    { id: 'boards', label: 'Boards' },
  ] as const;

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0c0f] text-[#dcdfe4]">
      {/* Profile Header */}
      <div className="flex items-center justify-center p-12 bg-[#15171b] border-b border-white/5">
        <div className="max-w-[700px] w-full flex items-center gap-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-[36px] font-semibold text-white shrink-0" 
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.initials}
          </div>
          <div className="flex-1">
            <h1 className="text-[28px] font-semibold leading-tight text-white">{currentUser.name}</h1>
            <p className="text-[14px] text-[#9fadbc] mt-1">{usernameHandle}</p>
          </div>
          <button className="px-4 py-2 rounded-[3px] bg-[#2c2b30] hover:bg-[#36353b] font-medium text-[14px] transition-colors">
            Edit profile
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex justify-center border-b border-white/5 bg-[#16181d]">
        <div className="max-w-[900px] w-full flex gap-1 px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-[#579dff] text-[#579dff]' 
                  : 'border-transparent text-[#9fadbc] hover:text-[#dcdfe4] hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[900px] mx-auto px-4 py-8">
        {activeTab === 'boards' ? (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                {workspace.name.substring(0, 1)}
              </div>
              <h2 className="text-[18px] font-semibold">{workspace.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {boards.map(board => (
                <div
                  key={board.id}
                  onClick={() => onOpenBoard(board.id)}
                  className="group rounded-xl overflow-hidden cursor-pointer bg-[#15171b] border border-black/20 hover:brightness-110 transition-all min-h-[96px] w-full relative"
                >
                  <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ background: board.background }} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
                  
                  <div className="relative z-20 px-3 py-2 flex flex-col h-full justify-between">
                    <span className="text-[14.5px] font-medium text-white line-clamp-2">{board.title}</span>
                    
                    <button
                      onClick={e => { e.stopPropagation(); onToggleStar(board.id); }}
                      className={`self-end flex items-center justify-center w-6 h-6 rounded-[3px] hover:bg-black/20 transition-opacity ${board.starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <Star className={`w-[13px] h-[13px] ${board.starred ? 'text-[#f2d600] fill-[#f2d600]' : 'text-white/80 hover:text-white hover:fill-white/80'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-[#9fadbc]">
            <p>This tab is not implemented in the current clone.</p>
          </div>
        )}
      </div>
    </div>
  );
}
