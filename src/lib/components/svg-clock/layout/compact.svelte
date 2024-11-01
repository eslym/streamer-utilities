<script lang="ts" module>
    export const name = 'Compact';
</script>

<script lang="ts">
    import type { ClockLayoutProps } from '../SVGClock.svelte';

    let { h, c, m, s, a }: ClockLayoutProps = $props();
</script>

<div class="flex flex-row">
    <div class="flex flex-row">
        {@render h?.()}
        {@render c?.()}
        {@render m?.()}
    </div>
    <div class="flex flex-col">
        {@render s?.(0.5, 0.5)}
        {@render a?.(0.5, 0.5)}
    </div>
</div>
