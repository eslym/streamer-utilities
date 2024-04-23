<script lang="ts">
    import SVGClock, {
        clockLayouts,
        defaultSettings,
        encodeSettings
    } from '$lib/components/SVGClock.svelte';
    import { json, local } from '$lib/stores';
    import { Hugeicon, Sun03Icon, Moon02Icon, ComputerIcon } from 'hugeicons-svelte';
    import { page } from '$app/stores';
    import ColorPicker from 'svelte-awesome-color-picker';
    import { fonts } from '$lib/svg-numbers';

    const placeholderTheme = local('transparent-placeholder');
    const themes = ['light', 'dark', null];

    const store = local('clock/svg');
    const clockSettings = json(store, () => ({ ...defaultSettings }));
</script>

<svelte:head>
    <title>Predefined Font Clock - Streamer Utilities</title>
    <meta name="description" content="Clock with predefined SVG fonts." />
</svelte:head>

<main class="mx-auto max-w-[600px] w-full flex flex-col gap-4">
    <div
        class="aspect-video rounded relative"
        class:bg-transparent-placeholder={$placeholderTheme === null}
        class:bg-transparent-placeholder-light={$placeholderTheme === 'light'}
        class:bg-transparent-placeholder-dark={$placeholderTheme === 'dark'}
    >
        <SVGClock
            font={$clockSettings.font}
            layout={clockLayouts[$clockSettings.layout]}
            color={$clockSettings.color}
            twelveHour={$clockSettings.twelveHour}
            showNight={$clockSettings.showNight}
            showSeconds={$clockSettings.showSeconds}
            showSeparator={$clockSettings.showSeparator}
            useDot={$clockSettings.useDot}
            blinkColon={$clockSettings.blinkColon}
            paddingX={$clockSettings.paddingX}
            paddingY={$clockSettings.paddingY}
        />
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
    <span class="tooltip-click tooltip-top" data-tooltip="Copied">
        <a
            href="/clock/svg/widget?{encodeSettings($clockSettings)}"
            class="btn btn-solid-primary h-14 py-2 flex flex-col items-center justify-center"
            on:click={(ev) => {
                if (ev.ctrlKey || ev.altKey || ev.shiftKey) return;
                ev.preventDefault();
                navigator.clipboard.writeText(
                    $page.url.to(`/clock/svg/widget?${encodeSettings($clockSettings)}`)
                );
            }}
        >
            <span class="text-base font-bold">Drag this to OBS</span>
            <span class="text-xs">or click to copy URL</span>
        </a>
    </span>
    <div class="form-group">
        <div class="form-field">
            <span class="form-label">Text Color</span>
            <div class="input input-lg max-w-full flex items-center justify-center">
                <ColorPicker --input-size="28px" bind:hex={$clockSettings.color} />
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div class="form-field">
                <label for="font">Font</label>
                <select id="font" class="select max-w-full" bind:value={$clockSettings.font}>
                    {#each Object.values(fonts) as font}
                        <option value={font.name}>{font.name}</option>
                    {/each}
                </select>
            </div>
            <div class="form-field">
                <label for="layout">Layout</label>
                <select id="layout" class="select max-w-full" bind:value={$clockSettings.layout}>
                    {#each Object.keys(clockLayouts) as layout}
                        <option value={layout}>{layout}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div class="form-field">
                <span></span>
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
                <span></span>
                <label>
                    <input type="checkbox" bind:checked={$clockSettings.showNight} class="switch" />
                    Show AM/PM
                </label>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div class="form-field">
                <span></span>
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
                <span></span>
                <label>
                    <input
                        type="checkbox"
                        bind:checked={$clockSettings.showSeparator}
                        class="switch"
                    />
                    Show Separator
                </label>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div class="form-field">
                <span></span>
                <label>
                    <input
                        type="checkbox"
                        bind:checked={$clockSettings.blinkColon}
                        class="switch"
                    />
                    Blink Separator
                </label>
            </div>
            <div class="form-field">
                <span></span>
                <label>
                    <input type="checkbox" bind:checked={$clockSettings.useDot} class="switch" />
                    Use dot for seconds
                </label>
            </div>
        </div>
        <div class="form-field">
            <label for="px" class="form-label">Padding X</label>
            <div class="input max-w-full flex items-center justify-center">
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
            <div class="input max-w-full flex items-center justify-center">
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
