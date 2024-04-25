<script lang="ts">
    import SVGClock, {
        defaultSettings,
        decodeSettings,
        clockLayouts
    } from '$lib/components/svg-clock/SVGClock.svelte';
    import { page } from '$app/stores';

    let clockSettings = defaultSettings;

    $: if (!import.meta.env.SSR) clockSettings = decodeSettings($page.url.searchParams);
</script>

<svelte:head>
    <title>Clock</title>
    <style>
        html,
        body {
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
            background-color: transparent !important;
        }
    </style>
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
