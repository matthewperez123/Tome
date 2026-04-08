// Data fetching layer with in-memory cache
const cache = new Map();

async function fetchJSON(path) {
  if (cache.has(path)) return cache.get(path);

  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);

  const data = await response.json();
  cache.set(path, data);
  return data;
}

export async function getManifest(lang) {
  return fetchJSON(`data/${lang}/manifest.json`);
}

export async function getLesson(lang, lessonId) {
  return fetchJSON(`data/${lang}/${lessonId}.json`);
}

export function clearCache() {
  cache.clear();
}
