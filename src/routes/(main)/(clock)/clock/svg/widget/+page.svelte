<script lang="ts">
    import SVGClock, { decodeSettings, clockLayouts } from '$lib/components/SVGClock.svelte';
    import { page } from '$app/stores';

    $: clockSettings = decodeSettings($page.url.searchParams);
</script>

<svelte:head>
    <title>Clock</title>
</svelte:head>

<div class="w-screen h-screen">
    <SVGClock
        font={clockSettings.font}
        layout={clockLayouts[clockSettings.layout]}
        color={clockSettings.color}
        twelveHour={clockSettings.twelveHour}
        showNight={clockSettings.showNight}
        showSeconds={clockSettings.showSeconds}
        showSeparator={clockSettings.showSeparator}
        useDot={clockSettings.useDot}
        blinkColon={clockSettings.blinkColon}
        paddingX={clockSettings.paddingX}
        paddingY={clockSettings.paddingY}
    />
</div>
