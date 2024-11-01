<script lang="ts">
    import GoogleFontLoader from '$lib/components/GoogleFontLoader.svelte';
    import { css } from '$lib/utils';
    import CounterStyleClock, {
        defaultSettings,
        decodeSettings,
        toProps
    } from '$lib/components/CounterStyleClock.svelte';
    import { page } from '$app/stores';

    let clockSettings = $state(defaultSettings);

    $effect.pre(() => {
        if (!import.meta.env.SSR) clockSettings = decodeSettings($page.url.searchParams);
    });
    let calculated = $derived(toProps(clockSettings));
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

{#if clockSettings.googleFont}
    <GoogleFontLoader families={[clockSettings.digitFont]} />
{/if}

<div style={css(calculated.styles)}>
    <CounterStyleClock {...calculated.props} />
</div>
