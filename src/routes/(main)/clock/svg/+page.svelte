<script lang="ts">
    import SVGClock, {
        clockLayouts,
        defaultSettings,
        encodeSettings
    } from '$lib/components/svg-clock/SVGClock.svelte';
    import { json, local } from '$lib/stores';
    import { Hugeicon, Sun03Icon, Moon02Icon, ComputerIcon } from 'hugeicons-svelte';
    import { page } from '$app/stores';
    import ColorPicker from 'svelte-awesome-color-picker';
    import { fonts } from '$lib/svg-numbers';

    const placeholderTheme = local('transparent-placeholder');
    const themes = ['light', 'dark', null];

    const store = local('clock/svg');
    const clockSettings = json(store, () => ({ ...defaultSettings }));

    $: if ($clockSettings._v !== defaultSettings._v) $store = null;

    $: if (!$clockSettings.showSeconds) $clockSettings.beforeSeconds = 'dot';

    let ratio: [number, number] = [0, 0];

    function buildSearch(params: URLSearchParams, width: number, height: number) {
        const r = Math.floor(Math.min(1920 / width, 1080 / height));
        params.set('layer-name', 'Clock');
        params.set('layer-width', `${width * r}`);
        params.set('layer-height', `${height * r}`);
        return params;
    }

    $: widgetParams = buildSearch(encodeSettings($clockSettings), ratio[0], ratio[1]);
</script>

<svelte:head>
    <title>Predefined Font Clock - Streamer Utilities</title>
    <meta name="description" content="Clock with predefined SVG fonts." />
</svelte:head>

<main class="mx-auto max-w-[600px] w-full flex flex-col gap-4">
    <div
        class="aspect-video relative card max-w-full"
        class:bg-transparent-placeholder={$placeholderTheme === null}
        class:bg-transparent-placeholder-light={$placeholderTheme === 'light'}
        class:bg-transparent-placeholder-dark={$placeholderTheme === 'dark'}
    >
        <SVGClock settings={$clockSettings} bind:ratio />
        <span
            class="tooltip tooltip-left absolute top-2 right-2"
            data-tooltip={{
                light: 'Light Background',
                dark: 'Dark Background'
            }[$placeholderTheme ?? ''] ?? 'Use System Theme'}
        >
            <button
                class="btn-circle btn btn-solid-secondary"
                on:click={() =>
                    ($placeholderTheme =
                        themes[(themes.indexOf($placeholderTheme) + 1) % themes.length])}
            >
                <Hugeicon
                    icon={{
                        light: Sun03Icon,
                        dark: Moon02Icon
                    }[$placeholderTheme ?? ''] ?? ComputerIcon}
                />
            </button>
        </span>
    </div>
    {#if ratio}
        <div class="text-center text-sm">
            Ratio: {ratio[0]} / {ratio[1]}
        </div>
    {/if}
    <span class="tooltip-click tooltip-top" data-tooltip="Copied">
        <a
            href="/clock/svg/widget?{widgetParams}"
            class="btn btn-solid-primary h-14 py-2 flex flex-col items-center justify-center"
            on:click={(ev) => {
                if (ev.ctrlKey || ev.altKey || ev.shiftKey) return;
                ev.preventDefault();
                navigator.clipboard.writeText($page.url.to(`/clock/svg/widget?${widgetParams}`));
            }}
        >
            <span class="text-base font-bold">Drag this to OBS</span>
            <span class="text-xs">or click to copy URL</span>
        </a>
    </span>
    <div class="form-group">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-3">
            <div class="form-field">
                <span class="form-label">Text Color</span>
                <div class="input input-lg max-w-full flex items-center justify-center">
                    <ColorPicker --input-size="28px" bind:hex={$clockSettings.color} />
                </div>
            </div>
            <div class="form-field">
                <span class="form-label">Secondary Color</span>
                <div class="input input-lg max-w-full flex items-center justify-center">
                    <ColorPicker --input-size="28px" bind:hex={$clockSettings.secondaryColor} />
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div class="form-field">
                <label for="font">Font</label>
                <select id="font" class="select max-w-full" bind:value={$clockSettings.font}>
                    {#each Object.values(fonts) as font}
                        <option value={font.id}>{font.name}</option>
                    {/each}
                </select>
            </div>
            <div class="form-field">
                <label for="layout">Layout</label>
                <select id="layout" class="select max-w-full" bind:value={$clockSettings.layout}>
                    {#each Object.entries(clockLayouts) as [id, layout]}
                        <option value={id}>{layout.name}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div class="form-field">
                <span class="form-label">&nbsp;</span>
                <label>
                    <input
                        type="checkbox"
                        bind:checked={$clockSettings.twelveHour}
                        class="switch"
                    />
                    12 Hours
                </label>
            </div>
            <div class="form-field">
                <span class="form-label">&nbsp;</span>
                <label>
                    <input type="checkbox" bind:checked={$clockSettings.showNight} class="switch" />
                    Show AM/PM
                </label>
            </div>
            <div class="form-field">
                <span class="form-label">&nbsp;</span>
                <label>
                    <input
                        type="checkbox"
                        bind:checked={$clockSettings.showSeconds}
                        class="switch"
                    />
                    Show Seconds
                </label>
            </div>
            <div class="form-field">
                <span class="form-label">&nbsp;</span>
                <label>
                    <input
                        type="checkbox"
                        bind:checked={$clockSettings.blinkColon}
                        class="switch"
                    />
                    Blink Colon
                </label>
            </div>
        </div>
        <div class="form-field">
            <span class="form-label">Before Minutes</span>
            <div class="pagination pagination-compact flex felx-row w-full">
                <input
                    id="min-none"
                    type="radio"
                    value="none"
                    bind:group={$clockSettings.beforeMinutes}
                />
                <label for="min-none" class="btn flex-grow">None</label>
                <input
                    id="min-space"
                    type="radio"
                    value="space"
                    bind:group={$clockSettings.beforeMinutes}
                />
                <label for="min-space" class="btn flex-grow">Space</label>
                <input
                    id="min-colon"
                    type="radio"
                    value="colon"
                    bind:group={$clockSettings.beforeMinutes}
                />
                <label for="min-colon" class="btn flex-grow">Colon</label>
            </div>
        </div>
        <div class="form-field">
            <span class="form-label">Before Seconds</span>
            <div class="pagination pagination-compact flex felx-row w-full">
                <input
                    disabled={!$clockSettings.showSeconds}
                    id="sec-none"
                    type="radio"
                    value="none"
                    bind:group={$clockSettings.beforeSeconds}
                />
                <label for="sec-none" class="btn flex-grow">None</label>
                <input
                    disabled={!$clockSettings.showSeconds}
                    id="sec-space"
                    type="radio"
                    value="space"
                    bind:group={$clockSettings.beforeSeconds}
                />
                <label for="sec-space" class="btn flex-grow">Space</label>
                <input
                    disabled={!$clockSettings.showSeconds}
                    id="sec-colon"
                    type="radio"
                    value="colon"
                    bind:group={$clockSettings.beforeSeconds}
                />
                <label for="sec-colon" class="btn flex-grow">Colon</label>
                <input
                    disabled={!$clockSettings.showSeconds}
                    id="sec-dot"
                    type="radio"
                    value="dot"
                    bind:group={$clockSettings.beforeSeconds}
                />
                <label for="sec-dot" class="btn flex-grow">Dot</label>
            </div>
        </div>
        <div class="form-field">
            <label for="px" class="form-label">Padding X</label>
            <div class="input input-solid max-w-full flex items-center justify-center">
                <input
                    id="px"
                    type="range"
                    bind:value={$clockSettings.paddingX}
                    step="0.0001"
                    min="0"
                    max="0.25"
                    class="range max-w-full w-full"
                />
            </div>
        </div>
        <div class="form-field">
            <label for="py" class="form-label">Padding Y</label>
            <div class="input input-solid max-w-full flex items-center justify-center">
                <input
                    id="py"
                    type="range"
                    bind:value={$clockSettings.paddingY}
                    step="0.0001"
                    min="0"
                    max="0.25"
                    class="range max-w-full w-full"
                />
            </div>
        </div>
        <button type="button" class="btn my-8" on:click={() => ($store = null)}>
            Reset to Default
        </button>
    </div>
</main>
