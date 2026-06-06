const CACHE_NAME = 'jimpitan-v1.8';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS.filter(u => !u.startsWith('http') || u.includes('fonts.googleapis') || u.includes('cdnjs'))))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('script.google.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/index.html'));
    })
  );
});

self.addEventListener('sync', e => {
  if (e.tag === 'sync-jimpitan') {
    e.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  const db = await openDB();
  const pending = await getAll(db, 'pending');
  const config = await getConfig();
  if (!config.sheetsUrl || !pending.length) return;
  for (const item of pending) {
    try {
      const res = await fetch(config.sheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': config.apiKey || '' },
        body: JSON.stringify(item)
      });
      if (res.ok) await deleteItem(db, 'pending', item.id);
    } catch {}
  }
}

function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('jimpitan', 1);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pending')) db.createObjectStore('pending', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('config')) db.createObjectStore('config', { keyPath: 'key' });
    };
  });
}
function getAll(db, store) {
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
function deleteItem(db, store, id) {
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(id);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
}
async function getConfig() {
  try {
    const db = await openDB();
    const items = await getAll(db, 'config');
    const cfg = {};
    items.forEach(i => { cfg[i.key] = i.value; });
    return cfg;
  } catch { return {}; }
}
