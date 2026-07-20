/**
 * 최근 사용한 사진 보관함 (기기 안에만 저장).
 *
 * 브라우저는 보안상 폰 앨범 목록을 읽을 수 없어서, 웹앱이 "최근 찍은 사진"을
 * 직접 나열하는 건 불가능하다. 대신 이 앱에서 한 번 고르거나 찍은 사진을
 * IndexedDB에 남겨두고 다음에 바로 꺼내 쓰게 한다.
 * 서버로 보내지 않으므로 다른 기기·다른 사람에게는 보이지 않는다.
 */

const DB_NAME = 'sodam-photos';
const STORE = 'recent';
const MAX_ITEMS = 12;

export interface RecentPhoto {
  id: number;
  blob: Blob;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** 최근 사진 목록 (최신순). 실패하면 빈 배열 — 부가 기능이라 흐름을 막지 않는다. */
export async function listRecentPhotos(): Promise<RecentPhoto[]> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => {
        const items = (req.result as RecentPhoto[]) ?? [];
        resolve(items.sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX_ITEMS));
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/** 사진 저장 후 오래된 항목 정리 */
export async function saveRecentPhoto(blob: Blob): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).add({ blob, createdAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });

    // 개수 제한 유지 (오래된 것부터 삭제)
    const all = await new Promise<RecentPhoto[]>((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve((req.result as RecentPhoto[]) ?? []);
      req.onerror = () => resolve([]);
    });
    if (all.length > MAX_ITEMS) {
      const stale = all.sort((a, b) => a.createdAt - b.createdAt).slice(0, all.length - MAX_ITEMS);
      const tx = db.transaction(STORE, 'readwrite');
      const store = tx.objectStore(STORE);
      stale.forEach((item) => store.delete(item.id));
    }
  } catch {
    // 저장 실패는 무시 — 사진 고르기 자체에는 영향 없음
  }
}
