<script lang="ts" module>
    export const name = 'Simple';
</script>

<script lang="ts">
    import type { ClockLayoutProps } from '../SVGClock.svelte';

    let { h, c, m, d, s, a }: ClockLayoutProps = $props();
</script>

<div class="flex flex-row">
    {@render h?.()}
    {@render c?.()}
    {@render m?.()}
    {@render d?.()}
    {@render s?.()}
    {@render a?.()}
</div>
