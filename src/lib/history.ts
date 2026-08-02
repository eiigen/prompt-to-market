const STORAGE_KEY = 'ptm_history';
const MAX_ENTRIES = 30;

export interface HistoryEntry {
  id: string;
  idea: string;
  textModel: string;
  imageModel: string;
  createdAt: number;
  outputs: { id: string; type: string; content?: string; url?: string; dataUrl?: string }[];
}

export function saveToHistory(entry: HistoryEntry) {
  const all = getHistory();
  all.unshift(entry);
  const dropped = all.slice(MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, MAX_ENTRIES)));
  dropped.forEach((e) => import('./imageStore').then((m) => m.deleteImages(e.id)).catch(() => {}));
}

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deleteHistoryEntry(id: string) {
  const all = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  import('./imageStore').then((m) => m.deleteImages(id)).catch(() => {});
}

export function clearHistory() {
  getHistory().forEach((e) => deleteHistoryEntry(e.id));
  localStorage.removeItem(STORAGE_KEY);
}
