<script lang="ts">
    import C from './SVGFontRenderer.svelte';
    import { clock } from '$lib/clock';
    import { fonts } from '$lib/svg-numbers';

    export let font = 'rubik-glitch';
    export let color = 'white';
    export let paddingX = 0.1;
    export let paddingY = 0.1;

    export let twelveHour = true;
    export let showSeconds = true;
    export let showNight = true;
    export let separateMinute = true;
    export let separateSecond = true;
    export let useDot = false;
    export let blinkSeparator = false;

    let scale = 1;

    let wrapperEl: HTMLDivElement;
    let clockEl: HTMLDivElement;

    $: fontData = fonts[font];
    $: clockString = `${$clock.h12}:${$clock.min}.${$clock.sec}${$clock.night ? 'PM' : 'AM'}`;

    function calculateSize() {}
</script>

<div class="h-full w-full flex items-center justify-center overflow-hidden" bind:this={wrapperEl}>
    <div style="transform: scale({scale});" class="flex flex-row" bind:this={clockEl}>
        {#each clockString.split('') as char}
            <C font={fontData} {char} color="white" />
        {/each}
    </div>
</div>
