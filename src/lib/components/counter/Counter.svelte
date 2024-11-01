<script lang="ts">
    import { quadIn } from 'svelte/easing';
    import CounterNumber from './CounterNumber.svelte';
    import type { ComponentProps } from 'svelte';

    type $$Props = Omit<ComponentProps<typeof CounterNumber>, 'chars' | 'char'> & {
        data: [string, string[]][][];
        easing?: any;
        animationDuration?: number;
    } & {
        [K in `--counter-${string}`]?: string;
    };

    let { data, easing = quadIn, animationDuration = 150 }: $$Props = $props();
</script>

<div class="counter-group">
    {#each data as group}
        <div class="digit-group">
            {#each group as [char, chars] (chars.join(''))}
                <CounterNumber {char} {chars} {easing} {animationDuration} />
            {/each}
        </div>
    {/each}
</div>

<style lang="postcss">
    .counter-group {
        @apply flex min-w-max max-w-max select-none flex-row;
        gap: var(--counter-group-gap, 0.5rem);
        padding: var(--counter-padding, 0.5rem);
        border-radius: var(--counter-radius, 0.5rem);
        background-color: var(--counter-bg, #f49b72);
    }
    .digit-group {
        @apply flex flex-row;
        gap: var(--counter-digit-gap, 0.15rem);
    }
</style>
