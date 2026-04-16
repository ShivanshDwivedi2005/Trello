const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  getWorkspace: () => request("/workspace"),
  updateWorkspace: (payload: { name: string; description: string }) =>
    request("/workspace", { method: "PATCH", body: JSON.stringify(payload) }),

  createBoard: (payload: { title: string; background: string }) =>
    request("/boards", { method: "POST", body: JSON.stringify(payload) }),
  getBoard: (boardId: string) => request(`/boards/${boardId}`),
  updateBoard: (boardId: string, payload: { title?: string; background?: string; starred?: boolean }) =>
    request(`/boards/${boardId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteBoard: (boardId: string) => request(`/boards/${boardId}`, { method: "DELETE" }),

  addList: (boardId: string, payload: { title: string }) =>
    request(`/boards/${boardId}/lists`, { method: "POST", body: JSON.stringify(payload) }),
  updateList: (listId: string, payload: { title: string }) =>
    request(`/lists/${listId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteList: (listId: string) => request(`/lists/${listId}`, { method: "DELETE" }),
  reorderLists: (boardId: string, payload: { sourceIndex: number; destIndex: number }) =>
    request(`/boards/${boardId}/lists/reorder`, { method: "POST", body: JSON.stringify(payload) }),

  addCard: (listId: string, payload: { title: string }) =>
    request(`/lists/${listId}/cards`, { method: "POST", body: JSON.stringify(payload) }),
  updateCard: (cardId: string, payload: any) =>
    request(`/cards/${cardId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteCard: (cardId: string) => request(`/cards/${cardId}`, { method: "DELETE" }),
  moveCard: (boardId: string, payload: { sourceListId: string; destListId: string; sourceIndex: number; destIndex: number }) =>
    request(`/boards/${boardId}/cards/move`, { method: "POST", body: JSON.stringify(payload) }),
};

