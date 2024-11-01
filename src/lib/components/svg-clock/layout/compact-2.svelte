<script lang="ts" module>
    export const name = 'Compact 2';
</script>

<script lang="ts">
    import type { ClockLayoutProps } from '../SVGClock.svelte';

    let { h, c, m, s, a }: ClockLayoutProps = $props();
</script>

<div class="flex flex-col">
    <div class="flex flex-row">
        {@render h?.()}
        {@render c?.()}
        {@render m?.()}
    </div>
    <div class="flex flex-row w-full justify-between">
        {@render s?.(1, 0.25)}
        {@render a?.(1, 0.25)}
    </div>
</div>
