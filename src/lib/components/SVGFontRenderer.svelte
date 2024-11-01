<script lang="ts">
    import type { FontData } from '$lib/svg-numbers';

    interface Props {
        char: string;
        font: FontData;
        primaryColor: string;
        secondaryColor: string;
        scaleX?: number;
        scaleY?: number;
    }

    let { char, font, primaryColor, secondaryColor, scaleX = 1, scaleY = 1 }: Props = $props();

    let data = $derived(font.chars[char]);
    let mx = $derived((data.mx ?? font.mx ?? 0) * scaleX);
    let my = $derived((data.my ?? font.my ?? 0) * scaleY);
    let width = $derived(data.w * scaleX);
    let height = $derived(data.h * scaleY);
</script>

<svg style="margin: {my}px {mx}px" {width} {height} viewBox="0 0 {width} {height}">
    <g transform="scale({scaleX} {scaleY})">
        {#each data.bg as path}
            <path fill={secondaryColor} d={path} />
        {/each}
        {#each data.fg as path}
            <path fill={primaryColor} d={path} />
        {/each}
    </g>
</svg>
