declare module '*.svelte.md' {
    import type { ComponentType, SvelteComponent } from 'svelte';
    const Component: ComponentType<SvelteComponent<{}, {}, {}>>;
    export default Component;
}

declare module '*.svx' {
    import type { ComponentType, SvelteComponent } from 'svelte';
    const Component: ComponentType<SvelteComponent<{}, {}, {}>>;
    export default Component;
}
