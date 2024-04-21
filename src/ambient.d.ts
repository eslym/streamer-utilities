declare module 'virtual:svg-numbers' {
    export type SVGNumberMetadata = {
        colon?: number;
        dot?: number;
        char?: number;
        width: number;
        height: number;
    };
    export const metadata: Record<string, SVGNumberMetadata>;
}

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
