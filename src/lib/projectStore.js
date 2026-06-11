// Local persistence for the project library using IndexedDB.
// Stores project metadata plus original file blobs so attachments
// survive reloads without any backend.

const DB_NAME = 'arch-project-library';
const DB_VERSION = 1;
const STORE = 'projects';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    const result = fn(store);
    t.oncomplete = () => resolve(result.result !== undefined ? result.result : undefined);
    t.onerror = () => reject(t.error);
  });
}

export async function getAllProjects() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveProject(project) {
  const db = await openDB();
  await tx(db, 'readwrite', (store) => store.put(project));
  return project;
}

export async function deleteProject(id) {
  const db = await openDB();
  await tx(db, 'readwrite', (store) => store.delete(id));
}
