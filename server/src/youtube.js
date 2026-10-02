// Keyless YouTube search: scrapes the public results page for video entries.
// Results are cached in memory for 10 minutes to avoid hammering YouTube.
const cache = new Map();
const TTL = 10 * 60 * 1000;

export async function searchYouTube(query, limit = 8) {
  const key = `${query}|${limit}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.items;

  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
  });
  const html = await res.text();
  const m = html.match(/var ytInitialData = (\{.+?\});<\/script>/s);
  if (!m) throw new Error('ytInitialData não encontrado');
  const data = JSON.parse(m[1]);

  const items = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object' || items.length >= limit) return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node.videoRenderer) {
      const v = node.videoRenderer;
      const title = v.title?.runs?.[0]?.text || v.title?.simpleText;
      if (v.videoId && title) {
        items.push({
          videoId: v.videoId,
          title,
          channel: v.ownerText?.runs?.[0]?.text || '',
          lengthText: v.lengthText?.simpleText || '',
        });
      }
    }
    for (const k of Object.keys(node)) walk(node[k]);
  };
  walk(data);

  cache.set(key, { at: Date.now(), items });
  return items;
}
