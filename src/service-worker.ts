/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

const FALLBACK = '/404.html';

const CACHEABLE_DESTINATIONS = new Set(['image', 'font']);

const UNCACHEABLE = new Set(['/_app/version.json', '/_app/env.js']);

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;
const ASSETS = [
    ...build, // the app itself
    ...files, // everything in `static`
    '/' // the root index.html
].filter((p) => !/(^|\/)\.[^\/]/.test(p));

self.addEventListener('install', ((event: ExtendableEvent) => {
    // Create a new cache and add all files to it
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }

    event.waitUntil(addFilesToCache());
}) as any);

self.addEventListener('activate', ((event: ExtendableEvent) => {
    // Remove previous cached data from disk
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) await caches.delete(key);
        }
    }

    event.waitUntil(deleteOldCaches());
}) as any);

self.addEventListener('fetch', ((event: FetchEvent) => {
    // ignore POST requests etc
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);

    if (url.origin !== location.origin) {
        if (CACHEABLE_DESTINATIONS.has(url.pathname.split('/')[1])) {
            event.respondWith(tryCacheRespond(event.request));
        }
        return;
    }

    if (ASSETS.includes(url.pathname)) {
        event.respondWith(respond(url.pathname));
    } else if (!import.meta.env.DEV && !UNCACHEABLE.has(url.pathname)) {
        event.respondWith(respond(FALLBACK));
    }
}) as any);

async function respond(pathname: string) {
    const cache = await caches.open(CACHE);
    return cache.match(pathname) as Promise<Response>;
}

async function tryCacheRespond(request: Request) {
    const cache = await caches.open(CACHE);
    try {
        const fresh = await fetch(request);
        await cache.put(request, fresh.clone());
        return fresh;
    } catch (e) {
        const response = await cache.match(request);
        if (response) return response;
        throw e;
    }
}
