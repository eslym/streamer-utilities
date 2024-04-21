import { type Writable, readable, type Readable, get, derived, writable } from 'svelte/store';

type Notifier<T> = (val: T) => void;

const noop: Notifier<any> = () => {};

export function json<T>(store: Writable<string | null | undefined>): Writable<T>;
export function json<T>(store: Writable<string | null | undefined>, fallback: T): Writable<T>;
export function json<T>(store: Writable<string | null | undefined>, fallback: () => T): Writable<T>;

/**
 * Creates a store that contains the parsed JSON of the given store.
 */
export function json<T>(
    store: Writable<string | null | undefined>,
    fallback?: (() => T) | T
): Writable<T> {
    const getval = typeof fallback === 'function' ? (fallback as () => T) : () => fallback;
    const base = derived(store, (val) => {
        if (val === null || val === undefined) return getval();
        return JSON.parse(val);
    });
    const set = (val: T) => store.set(JSON.stringify(val));
    const update = (fn: (val: T) => T) => set(fn(get(base)));
    return {
        subscribe: base.subscribe,
        set,
        update
    };
}

/**
 * Create a store that contains the value of the local storage and is aware of changes to its content.
 * Including calls to `localStorage.setItem`, `localStorage.removeItem` and `localStorage.clear`.
 *
 * It is fine to be called in SSR, it will return a store that contains `null`.
 */
let local: (key: string) => Writable<string | null>;

if (import.meta.env.SSR) {
    local = () => writable(null);
} else {
    const localStorageStores = new Map<
        string,
        [Writable<string | null>, Notifier<string | null>]
    >();

    const parent = Object.getPrototypeOf(localStorage) as Storage;
    const newProto = Object.create(parent) as Storage;

    Object.setPrototypeOf(localStorage, newProto);

    newProto.setItem = function (this: Storage, key: string, value: string) {
        parent.setItem.call(this, key, value);
        if (this === localStorage && localStorageStores.has(key))
            localStorageStores.get(key)![1](value);
    };

    newProto.removeItem = function (this: Storage, key: string) {
        parent.removeItem.call(this, key);
        if (this === localStorage && localStorageStores.has(key))
            localStorageStores.get(key)![1](null);
    };

    newProto.clear = function (this: Storage) {
        parent.clear.call(this);
        if (this === localStorage)
            for (const [_, notify] of localStorageStores.values()) notify(null);
    };

    window.addEventListener('storage', (e) => {
        if (e.storageArea && e.storageArea !== localStorage) return;
        if (e.key) {
            if (localStorageStores.has(e.key)) localStorageStores.get(e.key!)![1](e.newValue);
        } else for (const [_, notify] of localStorageStores.values()) notify(null);
    });

    local = function local(key: string): Writable<string | null> {
        if (localStorageStores.has(key)) return localStorageStores.get(key)![0];
        let ctx: [Writable<string | null>, Notifier<string | null>] = [null as any, noop];
        const base = readable<string | null>(null, (set) => {
            ctx[1] = set;
            set(localStorage.getItem(key));
            return () => (ctx[1] = noop);
        });
        const set = (val: string | null) => {
            if (val === null) parent.removeItem.call(localStorage, key);
            else parent.setItem.call(localStorage, key, val);
            ctx[1](val);
        };
        const update = (fn: (val: string | null) => string | null) =>
            set(fn(localStorage.getItem(key)));
        ctx[0] = {
            subscribe: base.subscribe,
            set,
            update
        };
        localStorageStores.set(key, ctx);
        return ctx[0];
    };
}

export { local };
