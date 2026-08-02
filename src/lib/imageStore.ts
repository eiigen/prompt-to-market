const DB = 'ptm_images';
const STORE = 'blobs';
const k = (entryId: string, outId: string) => `${entryId}:${outId}`;

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function putImage(entryId: string, outId: string, dataUrl: string): Promise<void> {
  const db = await open();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(dataUrl, k(entryId, outId));
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
}

export async function getImage(entryId: string, outId: string): Promise<string | undefined> {
  const db = await open();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(k(entryId, outId));
    req.onsuccess = () => res(req.result as string | undefined);
    req.onerror = () => rej(req.error);
    tx.oncomplete = () => db.close();
  });
}

export async function deleteImages(entryId: string): Promise<void> {
  const db = await open();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  store.openCursor().onsuccess = (e) => {
    const cur = (e.target as IDBRequest<IDBCursorWithValue>).result;
    if (cur) {
      if (String(cur.key).startsWith(entryId + ':')) store.delete(cur.key);
      cur.continue();
    }
  };
  await new Promise<void>((res) => { tx.oncomplete = () => { db.close(); res(); }; });
}
