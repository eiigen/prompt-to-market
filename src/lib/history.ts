const STORAGE_KEY = 'ptm_history';

export interface HistoryEntry {
  id: string;
  idea: string;
  textModel: string;
  imageModel: string;
  createdAt: number;
  outputs: { id: string; type: string; content?: string; url?: string }[];
}

export function saveToHistory(entry: HistoryEntry) {
  const all = getHistory();
  all.unshift(entry);
  if (all.length > 20) all.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deleteHistoryEntry(id: string) {
  const all = getHistory().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
