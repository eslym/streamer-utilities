<script lang="ts">
    import type { FontData } from '$lib/svg-numbers';

    export let char: string;
    export let font: FontData;
    export let primaryColor: string;
    export let secondaryColor: string;

    export let scaleX = 1;
    export let scaleY = 1;

    $: data = font.chars[char];
    $: mx = (data.mx ?? font.mx ?? 0) * scaleX;
    $: my = (data.my ?? font.my ?? 0) * scaleY;
    $: width = data.w * scaleX;
    $: height = data.h * scaleY;
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
