const CACHE_NAME = 'translation-models-v1';

async function getCache() {
  return caches.open(CACHE_NAME);
}

function cacheKey(filename) {
  return `https://models.local/${filename}`;
}

async function hasFile(filename) {
  const cache = await getCache();
  const response = await cache.match(cacheKey(filename));
  return !!response;
}

async function getFile(filename) {
  const cache = await getCache();
  const response = await cache.match(cacheKey(filename));
  if (!response) return null;
  return response.arrayBuffer();
}

async function putFile(filename, data) {
  const cache = await getCache();
  const response = new Response(data);
  await cache.put(cacheKey(filename), response);
}

async function deleteFile(filename) {
  const cache = await getCache();
  await cache.delete(cacheKey(filename));
}

async function hasAllFiles(filenames) {
  for (const f of filenames) {
    if (!(await hasFile(f))) return false;
  }
  return true;
}

async function listCachedFiles() {
  const cache = await getCache();
  const keys = await cache.keys();
  return keys.map(r => {
    const url = new URL(r.url);
    return url.pathname.slice(1); // remove leading /
  });
}

async function downloadAndCache(url, filename, onProgress) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (onProgress) onProgress(received, total);
  }

  const compressed = new Blob(chunks);
  const ds = new DecompressionStream('gzip');
  const decompressed = compressed.stream().pipeThrough(ds);
  const decompressedBlob = await new Response(decompressed).arrayBuffer();

  await putFile(filename, decompressedBlob);
  return decompressedBlob;
}

export { hasFile, getFile, putFile, deleteFile, hasAllFiles, listCachedFiles, downloadAndCache };
