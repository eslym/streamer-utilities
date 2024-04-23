<script lang="ts" context="module">
    export type LayoutDef = {
        grid: string;
        'grid-00'?: string;
        'grid-01'?: string;
        'grid-10'?: string;
        'grid-11'?: string;
    } & {
        [S in 'h' | 'm' | 's' | 'a']?: number;
    };

    export const clockLayouts: Record<string, LayoutDef> = {
        simple: {
            grid: '"h m s a"',
            'grid-00': '"h m"',
            'grid-01': '"h m s"',
            'grid-10': '"h m a"'
        },
        compact: {
            grid: '"h m a" "h m s"',
            'grid-00': '"h m"',
            'grid-01': '"h m s" "h m x"',
            'grid-10': '"h m a" "h m x"',
            s: 0.5,
            a: 0.5
        }
    };

    export const defaultSettings = {
        font: 'dot-gothic-16',
        layout: 'simple',
        color: '#000000',
        twelveHour: true,
        showSeconds: false,
        showNight: true,
        showSeparator: true,
        useDot: true,
        blinkColon: false,
        paddingX: 0.05,
        paddingY: 0.05
    };

    const propMap: Record<keyof typeof defaultSettings, string> = {
        font: 'f',
        layout: 'l',
        color: 'c',
        twelveHour: '12',
        showSeconds: 'S',
        showNight: 'a',
        showSeparator: ':',
        useDot: '.',
        blinkColon: 'b',
        paddingX: 'px',
        paddingY: 'py'
    };

    const mapProp = Object.fromEntries(Object.entries(propMap).map(([k, v]) => [v, k])) as Record<
        string,
        keyof typeof defaultSettings
    >;

    export function decodeSettings(params: URLSearchParams) {
        const settings = { ...defaultSettings };
        for (const [key, value] of params) {
            if (key in mapProp) {
                if (!mapProp[key]) continue;
                const prop = mapProp[key];
                const type = typeof defaultSettings[prop];
                switch (type) {
                    case 'string':
                        (settings as any)[prop] = value;
                        break;
                    case 'number':
                        (settings as any)[prop] = Number(value);
                        break;
                    case 'boolean':
                        (settings as any)[prop] = positiveString.has(value);
                        break;
                }
            }
        }
        return settings;
    }

    export function encodeSettings(settings: typeof defaultSettings) {
        const params = new URLSearchParams();
        for (const [prop, value] of Object.entries(settings)) {
            if (value === defaultSettings[prop as keyof typeof defaultSettings]) continue;
            const key = propMap[prop as keyof typeof defaultSettings];
            if (key) params.set(key, String(value));
        }
        return params;
    }
</script>

<script lang="ts">
    import C from './SVGFontRenderer.svelte';
    import { clock } from '$lib/clock';
    import { fonts } from '$lib/svg-numbers';
    import { onresize } from '$lib/actions';
    import { tick } from 'svelte';
    import { positiveString } from '$lib/utils';
    import { browser } from '$app/environment';

    export let font: string;
    export let color = 'white';
    export let paddingX = 0.05;
    export let paddingY = 0.05;
    export let layout: LayoutDef;

    export let twelveHour = true;
    export let showSeconds = false;
    export let showNight = true;
    export let showSeparator = true;
    export let useDot = true;
    export let blinkColon = false;
    export let ratio = 1;

    let scale = 1;

    let wrapperEl: HTMLDivElement;
    let clockEl: HTMLDivElement;

    $: fontData = fonts[font];
    $: hour = $clock[twelveHour ? 'h12' : 'h24'];
    $: blink = showSeparator && (!blinkColon || $clock.blink);
    $: grid = (layout as any)[`grid-${Number(showNight)}${Number(showSeconds)}`] ?? layout.grid;

    $: browser && calculateSize(paddingX, paddingY);

    async function calculateSize(...args: any[]) {
        scale = 1;
        await tick();
        const { width, height } = wrapperEl.getBoundingClientRect();
        ratio = width / height;
        const { width: clockWidth, height: clockHeight } = clockEl.getBoundingClientRect();

        const mw = width * (1 - paddingX * 2);
        const mh = height * (1 - paddingY * 2);

        const scaleX = mw / clockWidth;
        const scaleY = mh / clockHeight;

        scale = Math.min(scaleX, scaleY);
    }
</script>

<div
    use:onresize={calculateSize}
    class="h-full w-full flex items-center justify-center overflow-hidden"
    bind:this={wrapperEl}
>
    <div
        style="transform: scale({scale}); grid-template-areas: {grid};"
        class="grid"
        use:onresize={calculateSize}
        bind:this={clockEl}
    >
        <div style="grid-area: h;" class="flex flex-row items-center justify-center">
            <C
                font={fontData}
                char={hour[0]}
                {color}
                scaleX={layout.h ?? 1}
                scaleY={layout.h ?? 1}
            />
            <C
                font={fontData}
                char={hour[1]}
                {color}
                scaleX={layout.h ?? 1}
                scaleY={layout.h ?? 1}
            />
        </div>
        <div style="grid-area: m;" class="flex flex-row items-center justify-center">
            <C
                font={fontData}
                char=":"
                color={blink ? color : 'transparent'}
                scaleX={layout.m ?? 1}
                scaleY={layout.m ?? 1}
            />
            <C
                font={fontData}
                char={$clock.min[0]}
                {color}
                scaleX={layout.m ?? 1}
                scaleY={layout.m ?? 1}
            />
            <C
                font={fontData}
                char={$clock.min[1]}
                {color}
                scaleX={layout.m ?? 1}
                scaleY={layout.m ?? 1}
            />
        </div>
        {#if showSeconds}
            <div style="grid-area: s;" class="flex flex-row items-center justify-center">
                {#if useDot}
                    <C
                        font={fontData}
                        char="."
                        {color}
                        scaleX={layout.s ?? 1}
                        scaleY={layout.s ?? 1}
                    />
                {:else if showSeparator}
                    <C
                        font={fontData}
                        char={useDot ? '.' : ':'}
                        color={blink ? color : 'transparent'}
                        scaleX={layout.s ?? 1}
                        scaleY={layout.s ?? 1}
                    />
                {/if}
                <C
                    font={fontData}
                    char={$clock.sec[0]}
                    {color}
                    scaleX={layout.s ?? 1}
                    scaleY={layout.s ?? 1}
                />
                <C
                    font={fontData}
                    char={$clock.sec[1]}
                    {color}
                    scaleX={layout.s ?? 1}
                    scaleY={layout.s ?? 1}
                />
            </div>
        {/if}
        {#if showNight}
            <div style="grid-area: a;" class="flex flex-row items-center justify-center">
                <C
                    font={fontData}
                    char={$clock.pm ? 'P' : 'A'}
                    {color}
                    scaleX={layout.a ?? 1}
                    scaleY={layout.a ?? 1}
                />
                <C font={fontData} char="M" {color} scaleX={layout.a ?? 1} scaleY={layout.a ?? 1} />
            </div>
        {/if}
    </div>
</div>
