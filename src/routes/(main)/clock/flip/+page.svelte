<script lang="ts">
    import { json, local } from '$lib/stores';
    import CounterStyleClock from '$lib/components/CounterStyleClock.svelte';
    import {
        defaultSettings,
        encodeSettings,
        toProps
    } from '$lib/components/CounterStyleClock.svelte';
    import { Sun03Icon, Moon02Icon, ComputerIcon, GoogleIcon } from 'hugeicons-svelte';
    import cloneDeep from 'lodash.clonedeep';
    import { css } from '$lib/utils';
    import { page } from '$app/stores';
    import ColorPicker from 'svelte-awesome-color-picker';
    import GoogleFontLoader from '$lib/components/GoogleFontLoader.svelte';
    import SidesConfig from '$lib/components/SidesConfig.svelte';
    import { onMount } from 'svelte';
    import { onresize } from '$lib/actions';

    const placeholderTheme = local('transparent-placeholder');
    const themes = ['light', 'dark', null];

    const store = local('clock/counter-style');
    const settings = json(store, () => cloneDeep(defaultSettings));

    let scale = json(local('clock/counter-style/preview-scale'), 1);

    let googleFonts: string[] = $state($settings.googleFont ? [$settings.digitFont] : []);

    let clockEl: HTMLDivElement = $state(undefined as any);

    let clockWidth = $state(0);
    let clockHeight = $state(0);

    function updateSize() {
        if (!import.meta.env.SSR) {
            clockWidth = clockEl.clientWidth;
            clockHeight = clockEl.clientHeight;
        }
    }

    function buildSearch(params: URLSearchParams, width: number, height: number) {
        params.set('layer-name', 'Clock');
        params.set('layer-width', `${width}`);
        params.set('layer-height', `${height}`);
        return params;
    }

    onMount(() => {
        updateSize();
    });

    let calculated = $derived(toProps($settings));

    $effect.pre(() => {
        if (!$settings.googleFont) {
            googleFonts = [];
            return;
        }
        let timeout = setTimeout(() => {
            googleFonts = $settings.googleFont ? [$settings.digitFont] : [];
        }, 500);
        return () => clearTimeout(timeout);
    });

    let widgetParams = $derived(buildSearch(encodeSettings($settings), clockWidth, clockHeight));

    let ThemeIcon = $derived(
        {
            light: Sun03Icon,
            dark: Moon02Icon
        }[$placeholderTheme ?? ''] ?? ComputerIcon
    );
</script>

<svelte:head>
    <title>Flip Clock - Streamer Utitilies</title>
    <meta name="description" content="A flip style clock." />
</svelte:head>

<GoogleFontLoader families={googleFonts} />

<main class="mx-auto max-w-[600px] w-full flex flex-col gap-4">
    <div
        class="aspect-video card max-w-full flex items-center justify-center overflow-hidden sticky top-4 z-20"
        class:bg-transparent-placeholder={$placeholderTheme === null}
        class:bg-transparent-placeholder-light={$placeholderTheme === 'light'}
        class:bg-transparent-placeholder-dark={$placeholderTheme === 'dark'}
        style={css(calculated.styles)}
    >
        <div style="transform: scale({$scale})" bind:this={clockEl} use:onresize={updateSize}>
            <CounterStyleClock {...calculated.props} />
        </div>
        <span
            class="tooltip tooltip-left absolute top-2 right-2"
            data-tooltip={{
                light: 'Light Background',
                dark: 'Dark Background'
            }[$placeholderTheme ?? ''] ?? 'Use System Theme'}
        >
            <button
                class="btn-circle btn btn-solid-secondary"
                onclick={() =>
                    ($placeholderTheme =
                        themes[(themes.indexOf($placeholderTheme) + 1) % themes.length])}
            >
                <ThemeIcon />
            </button>
        </span>
        <span class="text-center absolute bottom-2 left-0 right-0 drop-shadow">
            {clockWidth}px / {clockHeight}px
        </span>
    </div>
    <div class="input input-sm input-solid flex flex-row max-w-full items-center">
        <span class="form-label"> Preview Scale </span>
        <input
            type="range"
            min="0.2"
            max="5"
            step="0.0001"
            bind:value={$scale}
            class="range h-auto flex-grow ml-2"
            list="scale-ticks"
        />
        <span class="w-16 text-right">
            {($scale * 100).toFixed(2).replace(/\.?0+$/, '')}%
        </span>
        <datalist id="scale-ticks">
            <option value="1"></option>
        </datalist>
    </div>
    <span class="tooltip-click tooltip-top" data-tooltip="Copied">
        <a
            href="/clock/counter-style/widget?{widgetParams}"
            class="btn btn-solid-primary h-14 py-2 flex flex-col items-center justify-center"
            onclick={(ev) => {
                if (ev.ctrlKey || ev.altKey || ev.shiftKey) return;
                ev.preventDefault();
                navigator.clipboard.writeText(
                    $page.url.to(`/clock/counter-style/widget?${widgetParams}`)
                );
            }}
        >
            <span class="text-base font-bold">Drag this to OBS</span>
            <span class="text-xs">or click to copy URL</span>
        </a>
    </span>
    <div class="form-group">
        <div class="grid grid-cols-2 gap-y-3 gap-x-2">
            <div class="form-field">
                <span class="form-label">Mode</span>
                <div class="pagination pagination-compact w-full flex flex-row">
                    <input type="radio" id="12h" value={true} bind:group={$settings.twelveHour} />
                    <label for="12h" class="btn flex-grow">12 Hour</label>
                    <input type="radio" id="24h" value={false} bind:group={$settings.twelveHour} />
                    <label for="24h" class="btn flex-grow">24 Hour</label>
                </div>
            </div>
            <div class="form-field">
                <span class="form-label">Seconds</span>
                <div class="pagination pagination-compact w-full flex flex-row">
                    <input
                        type="radio"
                        id="hide-s"
                        value={false}
                        bind:group={$settings.showSeconds}
                    />
                    <label for="hide-s" class="btn flex-grow">Hide</label>
                    <input
                        type="radio"
                        id="show-s"
                        value={true}
                        bind:group={$settings.showSeconds}
                    />
                    <label for="show-s" class="btn flex-grow">Show</label>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-3">
            <div class="form-field">
                <span class="form-label">Text Color</span>
                <div class="input input-solid input-lg max-w-full flex items-center justify-center">
                    <ColorPicker --input-size="28px" bind:hex={$settings.digitColor} />
                </div>
            </div>
            <div class="form-field">
                <span class="form-label">Background Color</span>
                <div class="input input-solid input-lg max-w-full flex items-center justify-center">
                    <ColorPicker --input-size="28px" bind:hex={$settings.background} />
                </div>
            </div>
            <div class="form-field">
                <span class="form-label">Digit Background</span>
                <div class="input input-solid input-lg max-w-full flex items-center justify-center">
                    <ColorPicker --input-size="28px" bind:hex={$settings.digitBackground} />
                </div>
            </div>
            <div class="form-field">
                <span class="form-label">Digit Divider</span>
                <div class="input input-solid input-lg max-w-full flex items-center justify-center">
                    <ColorPicker --input-size="28px" bind:hex={$settings.digitDividerColor} />
                </div>
            </div>
        </div>
        <div class="form-field">
            <label for="font" class="form-label">Font</label>
            <div class="flex flex-row gap-2 items-center justify-center">
                <input
                    type="text"
                    id="font"
                    class="input input-solid flex-grow max-w-full"
                    bind:value={$settings.digitFont}
                    placeholder="monospace"
                />
                <span
                    class="tooltip tooltip-left"
                    data-tooltip={$settings.googleFont
                        ? 'Disable Google Font'
                        : 'Enable Google Font'}
                >
                    <button
                        class="btn btn-circle"
                        class:btn-primary={$settings.googleFont}
                        onclick={() => ($settings.googleFont = !$settings.googleFont)}
                    >
                        <GoogleIcon />
                    </button>
                </span>
            </div>
        </div>
        <div class="form-field">
            <label for="font-size" class="form-label">Font Size</label>
            <input
                type="number"
                id="font-size"
                class="input input-solid max-w-full"
                bind:value={$settings.digitFontSize}
                placeholder="64px"
            />
        </div>
        <div class="grid grid-cols-2 gap-y-3 gap-x-2">
            <div class="form-field">
                <label for="width" class="form-label">Digit Width</label>
                <input
                    type="number"
                    id="width"
                    class="input input-solid max-w-full"
                    bind:value={$settings.digitWidth}
                    placeholder="48px"
                />
            </div>
            <div class="form-field">
                <label for="height" class="form-label">Digit Height</label>
                <input
                    type="number"
                    id="height"
                    class="input input-solid max-w-full"
                    bind:value={$settings.digitHeight}
                    placeholder="64px"
                />
            </div>
            <div class="form-field">
                <label for="radius" class="form-label">Border Radius</label>
                <input
                    type="number"
                    id="radius"
                    class="input input-solid max-w-full"
                    bind:value={$settings.radius}
                    placeholder="8px"
                />
            </div>
            <div class="form-field">
                <label for="radius-digit" class="form-label">Border Radius (Digits)</label>
                <input
                    type="number"
                    id="radius-digit"
                    class="input input-solid max-w-full"
                    bind:value={$settings.digitRadius}
                    placeholder="4px"
                />
            </div>
            <div class="form-field">
                <label for="gap-group" class="form-label">Components Spacing</label>
                <input
                    type="number"
                    id="gap-group"
                    class="input input-solid max-w-full"
                    bind:value={$settings.spacing}
                    placeholder="12px"
                />
            </div>
            <div class="form-field">
                <label for="gap-digit" class="form-label">Digits Spacing</label>
                <input
                    type="number"
                    id="gap-digit"
                    class="input input-solid max-w-full"
                    bind:value={$settings.digitSpacing}
                    placeholder="4px"
                />
            </div>
        </div>
        <div class="form-field">
            <label for="ani-duration" class="form-label">Animation Duration</label>
            <div class="input input-solid max-w-full flex flex-row items-center">
                <input
                    type="range"
                    id="ani-duration"
                    class="range max-w-full w-full h-auto"
                    bind:value={$settings.animationDuration}
                    placeholder="4px"
                    min="100"
                    max="500"
                    list="duration-ticks"
                />
                <span class="w-16 text-right">{$settings.animationDuration}ms</span>
                <datalist id="duration-ticks">
                    <option value="100"></option>
                    <option value="150"></option>
                    <option value="200"></option>
                    <option value="250"></option>
                    <option value="300"></option>
                    <option value="350"></option>
                    <option value="400"></option>
                    <option value="450"></option>
                    <option value="500"></option>
                </datalist>
            </div>
        </div>
        <div class="form-field">
            <label for="digit-divider" class="form-label">Digits Divider</label>
            <input
                type="number"
                id="digit-divider"
                class="input input-solid max-w-full"
                bind:value={$settings.digitDivider}
                placeholder="2px"
            />
        </div>
        <div class="form-field">
            <span class="form-label">Digit Alignment</span>
            <div class="input input-solid max-w-full h-auto grid grid-cols-3 p-2 gap-2">
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="1" bind:group={$settings.digitAlign} />
                </div>
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="2" bind:group={$settings.digitAlign} />
                </div>
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="3" bind:group={$settings.digitAlign} />
                </div>
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="4" bind:group={$settings.digitAlign} />
                </div>
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="5" bind:group={$settings.digitAlign} />
                </div>
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="6" bind:group={$settings.digitAlign} />
                </div>
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="7" bind:group={$settings.digitAlign} />
                </div>
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="8" bind:group={$settings.digitAlign} />
                </div>
                <div class="flex justify-center">
                    <input type="radio" class="radio" value="9" bind:group={$settings.digitAlign} />
                </div>
            </div>
        </div>
        <div class="divider mb-0">Clock Padding</div>
        <SidesConfig bind:sides={$settings.padding} defaultSides={defaultSettings.padding} />
        <div class="divider mb-0">Digit Padding</div>
        <SidesConfig bind:sides={$settings.digitPadding} defaultSides={defaultSettings.padding} />
        <button type="button" class="btn my-12" onclick={() => ($store = null)}>
            Reset to Default
        </button>
    </div>
</main>
