<script lang="ts">
    import SVGClock, {
        defaultSettings,
        decodeSettings
    } from '$lib/components/svg-clock/SVGClock.svelte';
    import { page } from '$app/stores';

    let clockSettings = $state(defaultSettings);

    $effect.pre(() => {
        if (!import.meta.env.SSR) clockSettings = decodeSettings($page.url.searchParams);
    });
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
    <SVGClock settings={clockSettings} />
</div>
