const resizeCallbacks = new Set<(el: Element) => void>();

let resizeObserver: ResizeObserver;

if (!import.meta.env.SSR) {
    resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            for (const callback of resizeCallbacks) {
                callback(entry.target as Element);
            }
        }
    });
}

export function onresize<E extends Element>(el: E, callback: (el: E) => void) {
    const cb = (el: Element) => callback(el as E);
    resizeCallbacks.add(cb);
    resizeObserver.observe(el);

    return {
        update(newCallback: (el: E) => void) {
            callback = newCallback;
        },
        destroy() {
            resizeCallbacks.delete(cb);
            resizeObserver.unobserve(el);
        }
    };
}
