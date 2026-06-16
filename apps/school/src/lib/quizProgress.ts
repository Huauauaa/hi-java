export type QuizStatus = 'done' | 'doing' | 'todo';

export type SubmitVersion = {
  submittedAt: number;
  content: string;
  pass: boolean;
  message: string;
};

export type QuizRecord = {
  chapterId: string;
  status: 'doing' | 'done';
  content: string;
  updatedAt: number;
  submissions: SubmitVersion[];
};

const DB_NAME = 'hi-java-school';
const STORE = 'quiz-progress';
const DB_VERSION = 1;
const MAX_SUBMISSIONS = 5;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'chapterId' });
      }
    };
  });
}

async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
}

function normalize(record: QuizRecord | null | undefined): QuizRecord | null {
  if (!record) return null;
  return { ...record, submissions: record.submissions ?? [] };
}

let migrated = false;

/** ponytail: one-shot localStorage → IndexedDB migration */
async function migrateFromLocalStorage() {
  if (migrated) return;
  migrated = true;
  const raw = localStorage.getItem('java-route-done-ids');
  if (!raw) return;
  try {
    const ids: string[] = JSON.parse(raw);
    const existing = await getAllRecords();
    const map = new Map(existing.map((r) => [r.chapterId, r]));
    for (const id of ids) {
      if (!map.has(id)) {
        await saveRecord(id, '', 'done');
      }
    }
  } finally {
    localStorage.removeItem('java-route-done-ids');
    localStorage.removeItem('java-route-done');
  }
}

export async function getRecord(chapterId: string): Promise<QuizRecord | null> {
  await migrateFromLocalStorage();
  return normalize(await withStore('readonly', (s) => s.get(chapterId)));
}

export async function getAllRecords(): Promise<QuizRecord[]> {
  await migrateFromLocalStorage();
  const rows = await withStore('readonly', (s) => s.getAll());
  return rows.map((r) => normalize(r)!);
}

export async function saveRecord(chapterId: string, content: string, status: 'doing' | 'done'): Promise<void> {
  await migrateFromLocalStorage();
  const prev = normalize(await withStore('readonly', (s) => s.get(chapterId)));
  const record: QuizRecord = {
    chapterId,
    content,
    status,
    updatedAt: Date.now(),
    submissions: prev?.submissions ?? [],
  };
  await withStore('readwrite', (s) => s.put(record));
}

/** 每次「提交」追加一条记录，最多保留 MAX_SUBMISSIONS 条 */
export async function addSubmission(
  chapterId: string,
  content: string,
  pass: boolean,
  message: string,
): Promise<SubmitVersion[]> {
  await migrateFromLocalStorage();
  const prev = normalize(await withStore('readonly', (s) => s.get(chapterId)));
  const entry: SubmitVersion = { submittedAt: Date.now(), content, pass, message };
  const submissions = [entry, ...(prev?.submissions ?? [])].slice(0, MAX_SUBMISSIONS);
  const record: QuizRecord = {
    chapterId,
    content,
    status: pass ? 'done' : prev?.status === 'done' ? 'done' : 'doing',
    updatedAt: Date.now(),
    submissions,
  };
  await withStore('readwrite', (s) => s.put(record));
  return submissions;
}

export function statusOf(chapterId: string, map: Map<string, QuizRecord>): QuizStatus {
  const r = map.get(chapterId);
  if (!r) return 'todo';
  return r.status;
}

export async function loadProgressMap(): Promise<Map<string, QuizRecord>> {
  const rows = await getAllRecords();
  return new Map(rows.map((r) => [r.chapterId, r]));
}
