import { useEffect, useMemo, useState, useCallback } from 'react';
import { Board, Card, Workspace } from '@/types/kanban';
import { api } from '@/lib/api';

export function useBoardState() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const boards = useMemo(() => workspace?.boards ?? [], [workspace]);
  const activeBoard = useMemo(() => (activeBoardId ? boards.find(b => b.id === activeBoardId) || null : null), [activeBoardId, boards]);

  const updateWorkspace = useCallback((updater: (ws: Workspace) => Workspace) => {
    setWorkspace(prev => (prev ? updater(prev) : prev));
  }, []);

  const refreshWorkspace = useCallback(async () => {
    const ws = await api.getWorkspace();
    setWorkspace(ws as Workspace);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshWorkspace().catch(() => setLoading(false));
  }, [refreshWorkspace]);

  const createBoard = useCallback(async (title: string, background: string) => {
    const b = (await api.createBoard({ title, background })) as Board;
    updateWorkspace(ws => ({ ...ws, boards: [...ws.boards.filter(x => x.id !== b.id), b] }));
    setActiveBoardId(b.id);
    return b;
  }, [updateWorkspace]);

  const deleteBoard = useCallback((boardId: string) => {
    (async () => {
      await api.deleteBoard(boardId);
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.filter(b => b.id !== boardId) }));
      if (activeBoardId === boardId) setActiveBoardId(null);
    })().catch(() => {});
  }, [activeBoardId, updateWorkspace]);

  const toggleStarBoard = useCallback((boardId: string) => {
    (async () => {
      const current = boards.find(b => b.id === boardId);
      if (!current) return;
      const b = (await api.updateBoard(boardId, { starred: !current.starred })) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [boards, updateWorkspace]);

  const openBoard = useCallback(async (boardId: string) => {
    const b = (await api.getBoard(boardId)) as Board;
    updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    setActiveBoardId(boardId);
    return b;
  }, [updateWorkspace]);

  const addList = useCallback((title: string) => {
    if (!activeBoardId) return;
    (async () => {
      const b = (await api.addList(activeBoardId, { title })) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [activeBoardId, updateWorkspace]);

  const updateList = useCallback((listId: string, title: string) => {
    (async () => {
      const b = (await api.updateList(listId, { title })) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [updateWorkspace]);

  const deleteList = useCallback((listId: string) => {
    (async () => {
      const b = (await api.deleteList(listId)) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [updateWorkspace]);

  const addCard = useCallback((listId: string, title: string) => {
    (async () => {
      const b = (await api.addCard(listId, { title })) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [updateWorkspace]);

  const updateCard = useCallback((listId: string, updatedCard: Card) => {
    (async () => {
      const b = (await api.updateCard(updatedCard.id, {
        title: updatedCard.title,
        description: updatedCard.description,
        dueDate: updatedCard.dueDate,
        coverColor: updatedCard.coverColor,
        archived: updatedCard.archived,
        labelIds: updatedCard.labels.map(l => l.id),
        memberIds: updatedCard.members.map(m => m.id),
      })) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [updateWorkspace]);

  const deleteCard = useCallback((listId: string, cardId: string) => {
    (async () => {
      const b = (await api.deleteCard(cardId)) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [updateWorkspace]);

  const moveCard = useCallback((sourceListId: string, destListId: string, sourceIndex: number, destIndex: number) => {
    if (!activeBoardId) return;
    (async () => {
      const b = (await api.moveCard(activeBoardId, { sourceListId, destListId, sourceIndex, destIndex })) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [activeBoardId, updateWorkspace]);

  const reorderLists = useCallback((sourceIndex: number, destIndex: number) => {
    if (!activeBoardId) return;
    (async () => {
      const b = (await api.reorderLists(activeBoardId, { sourceIndex, destIndex })) as Board;
      updateWorkspace(ws => ({ ...ws, boards: ws.boards.map(x => x.id === b.id ? b : x) }));
    })().catch(() => {});
  }, [activeBoardId, updateWorkspace]);

  const updateWorkspaceSettings = useCallback((name: string, description: string) => {
    (async () => {
      const ws = (await api.updateWorkspace({ name, description })) as Workspace;
      setWorkspace(ws);
    })().catch(() => {});
  }, []);

  return {
    workspace: workspace || ({ id: 'ws', name: 'Workspace', description: '', boards: [], members: [], labels: [] } as Workspace),
    boards,
    activeBoard,
    activeBoardId,
    setActiveBoardId, openBoard, createBoard, deleteBoard, toggleStarBoard,
    addList, updateList, deleteList,
    addCard, updateCard, deleteCard, moveCard, reorderLists,
    updateWorkspaceSettings,
    loading,
  };
}
