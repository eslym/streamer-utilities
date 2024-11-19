/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, prerendered, version } from '$service-worker';

const FALLBACK = '/404.html';

const UNCACHEABLE = new Set(['/_app/version.json', '/_app/env.js']);

const GOOGLE_FONTS_ORIGINS = new Set(['https://fonts.gstatic.com', 'https://fonts.googleapis.com']);

const FONT_CACHE = 'google-fonts';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;
const ASSETS = [
    ...build, // the app itself
    ...files, // everything in `static`
    ...prerendered,
    FALLBACK // the fallback page
];

const sw = self as ServiceWorkerGlobalScope & typeof globalThis;

sw.addEventListener('install', (event: ExtendableEvent) => {
    // Create a new cache and add all files to it
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(
            ASSETS.map((u) => {
                return new Request(u, {
                    cache: u.startsWith('/lib/immutable/') ? 'default' : 'reload'
                });
            })
        );
    }

    event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event: ExtendableEvent) => {
    // Remove previous cached data from disk
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE && key !== FONT_CACHE) await caches.delete(key);
        }
    }

    event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event: FetchEvent) => {
    // ignore POST requests etc
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);

    if (url.origin !== location.origin) {
        if (GOOGLE_FONTS_ORIGINS.has(url.origin)) {
            event.respondWith(gfontsCache(event.request));
        }
        return;
    }

    if (ASSETS.includes(url.pathname)) {
        event.respondWith(respond(url.pathname));
    } else if (!import.meta.env.DEV && !UNCACHEABLE.has(url.pathname)) {
        event.respondWith(respond(FALLBACK));
    }
});

async function respond(pathname: string) {
    const cache = await caches.open(CACHE);
    return cache.match(pathname) as Promise<Response>;
}

async function gfontsCache(request: Request) {
    const cache = await caches.open(FONT_CACHE);
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
