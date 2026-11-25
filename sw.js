"use strict";

const scope = new URL(self.registration.scope);
const cachePrefix = "mood-campus:" + scope.pathname + ":";
const cacheName = cachePrefix + "mobile-v9";
const shell = [
  "index.html", "style.css", "app.js", "garden.webp", "open-up-hero.webp", "moods.webp",
  "manifest.webmanifest", "icon-192.png", "icon-512.png", "mood-campus-figma-flow.svg",
  "flow.html", "flow.css", "flow.js"
].map(path => new URL(path, scope).href);
const shellFiles = new Set(shell);
const entry = shell[0];

self.addEventListener("install", event => {
  event.waitUntil(cacheApplication());
});

async function cacheApplication() {
  const cache = await caches.open(cacheName);
  const assets = await Promise.all(shell.map(async url => {
    const response = await fetch(url, {cache: "reload"});
    if (!response.ok || response.redirected) throw new Error("Application asset unavailable");
    return [url, response];
  }));
  await Promise.all(assets.map(([url, response]) => cache.put(url, response)));
  await self.skipWaiting();
}

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const previous = (await caches.keys()).filter(name => name.startsWith(cachePrefix) && name !== cacheName);
    await Promise.all(previous.map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const {request} = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const cleanUrl = new URL(url.pathname, url.origin).href;
  const {href} = url;
  const isDemoPhone = cleanUrl === entry && url.search === "?presentation=1";
  if (request.mode === "navigate" && (href === scope.href || href === entry || isDemoPhone)) {
    event.respondWith(networkFirst(request, entry));
  } else if (shellFiles.has(href)) {
    event.respondWith(networkFirst(request, href));
  }
});

async function networkFirst(request, cacheKey) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(cacheName);
    const saved = await cache.match(cacheKey);
    if (saved) return saved;
    throw error;
  }
}
