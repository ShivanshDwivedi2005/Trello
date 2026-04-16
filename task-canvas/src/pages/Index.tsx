import { useState } from 'react';
import { useBoardState } from '@/hooks/useBoardState';
import { SAMPLE_MEMBERS } from '@/types/kanban';
import TopNav from '@/components/TopNav';
import WorkspaceSidebar from '@/components/WorkspaceSidebar';
import HomeBoardsPage from '@/components/HomeBoardsPage';
import HomePage from '@/components/HomePage';
import TemplatesPage from '@/components/TemplatesPage';
import MembersPage from '@/components/MembersPage';
import SettingsPage from '@/components/SettingsPage';
import BoardView from '@/components/BoardView';

type Page = 'home' | 'boards' | 'members' | 'settings' | 'board' | 'templates';

export default function Index() {
  const {
    workspace, boards, activeBoard, activeBoardId,
    openBoard, createBoard, deleteBoard, toggleStarBoard,
    addList, updateList, deleteList,
    addCard, updateCard, deleteCard, moveCard, reorderLists,
    updateWorkspaceSettings,
  } = useBoardState();

  const [page, setPage] = useState<Page>('boards');
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = SAMPLE_MEMBERS[0];

  const handleOpenBoard = (id: string) => {
    openBoard(id);
    setPage('board');
  };

  const handleCreateBoard = (title: string, bg: string) => {
    createBoard(title, bg);
    setPage('board');
  };

  const handleNavigate = (p: Page) => setPage(p);
  const handleGoHome = () => setPage('boards');

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav
        boards={boards}
        onOpenBoard={handleOpenBoard}
        onCreateBoard={handleCreateBoard}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGoHome={handleGoHome}
        currentUser={currentUser}
      />

      <div className="flex-1 flex overflow-hidden">
        <WorkspaceSidebar
          workspace={workspace}
          activePage={page}
          onNavigate={handleNavigate}
        />

        {page === 'boards' && (
          <HomeBoardsPage boards={boards} workspace={workspace} onOpenBoard={handleOpenBoard} onCreateBoard={handleCreateBoard} onToggleStar={toggleStarBoard} onNavigate={handleNavigate} pageType="boards" />
        )}
        {page === 'home' && (
          <HomePage boards={boards} onOpenBoard={handleOpenBoard} onCreateBoard={handleCreateBoard} />
        )}
        {page === 'templates' && <TemplatesPage />}
        {page === 'members' && <MembersPage workspace={workspace} />}
        {page === 'settings' && <SettingsPage workspace={workspace} onSave={updateWorkspaceSettings} />}
        {page === 'board' && activeBoard && (
          <BoardView
            board={activeBoard}
            onAddList={addList}
            onUpdateList={updateList}
            onDeleteList={deleteList}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onMoveCard={moveCard}
            onReorderLists={reorderLists}
            onToggleStar={toggleStarBoard}
            searchQuery={searchQuery}
          />
        )}
        {page === 'board' && !activeBoard && (
          <div className="flex-1 flex items-center justify-center bg-background">
            <p className="text-muted-foreground">Board not found. <button onClick={handleGoHome} className="text-primary hover:underline">Go home</button></p>
          </div>
        )}
      </div>
    </div>
  );
}
