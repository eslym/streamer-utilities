<script lang="ts" module>
    export type ClockSettings = {
        _v: number;
        font: string;
        layout: string;
        color: string;
        secondaryColor: string;
        twelveHour: boolean;
        showSeconds: boolean;
        showNight: boolean;
        beforeMinutes: 'none' | 'space' | 'colon';
        beforeSeconds: 'none' | 'space' | 'colon' | 'dot';
        blinkColon: boolean;
        paddingX: number;
        paddingY: number;
    };

    export type ClockLayoutProps = {
        settings: ClockSettings;
    } & Record<
        'h' | 'm' | 's' | 'a' | 'c' | 'd',
        Snippet<[sx: number | undefined, sy: number | undefined] | []>
    >;

    export type ClockLayout = {
        name: string;
        default: Component<ClockLayoutProps>;
    };

    export const defaultSettings: ClockSettings = {
        _v: 2,
        font: 'dot-gothic-16',
        layout: 'simple',
        color: '#000000',
        secondaryColor: '#33333366',
        twelveHour: true,
        showSeconds: false,
        showNight: true,
        beforeMinutes: 'colon',
        beforeSeconds: 'dot',
        blinkColon: false,
        paddingX: 0.05,
        paddingY: 0.05
    };

    const propMap: Record<Exclude<keyof typeof defaultSettings, '_v'>, string> = {
        font: 'f',
        layout: 'l',
        color: 'fg',
        secondaryColor: 'bg',
        twelveHour: '12',
        showSeconds: 'S',
        showNight: 'a',
        beforeMinutes: ':',
        beforeSeconds: '.',
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
                const def = defaultSettings[prop];
                const type = typeof def;
                switch (type) {
                    case 'string':
                        (settings as any)[prop] = value;
                        break;
                    case 'number':
                        (settings as any)[prop] = Number(value);
                        break;
                    case 'boolean':
                        (settings as any)[prop] = parseBoolean(value, def as boolean);
                        break;
                }
            }
        }
        return settings;
    }

    export function encodeSettings(settings: typeof defaultSettings) {
        const params = new URLSearchParams();
        for (const [prop, value] of Object.entries(settings)) {
            if (!(prop in propMap)) continue;
            if (value === (defaultSettings as any)[prop]) continue;
            const key = (propMap as any)[prop];
            if (key) params.set(key, String(value));
        }
        return params;
    }

    const layouts = import.meta.glob('./layout/*.svelte', { eager: true });

    export const clockLayouts: Record<string, ClockLayout> = Object.fromEntries(
        Object.entries(layouts)
            .map(([path, layout]) => [
                path.match(/\.\/layout\/(.*)\.svelte$/)![1],
                layout as ClockLayout
            ])
            .sort(([_, a], [__, b]) => (a as any).name.localeCompare((b as any).name))
    );
</script>

<script lang="ts">
    import C from '../SVGFontRenderer.svelte';
    import { clock } from '$lib/clock';
    import { fonts } from '$lib/svg-numbers';
    import { onresize } from '$lib/actions';
    import { tick, type Component, type Snippet } from 'svelte';
    import { hcf, parseBoolean } from '$lib/utils';
    import { browser } from '$app/environment';

    interface Props {
        settings: ClockSettings;
        ratio?: [number, number];
    }

    let { settings, ratio = $bindable([NaN, NaN]) }: Props = $props();

    let scale = $state(1);

    let wrapperEl: HTMLDivElement = $state(undefined as any);
    let clockEl: HTMLDivElement = $state(undefined as any);

    async function calculateSize(..._: any[]) {
        scale = 1;
        await tick();
        const { width, height } = wrapperEl.getBoundingClientRect();

        const { width: clockWidth, height: clockHeight } = clockEl.getBoundingClientRect();

        const factor = hcf(Math.round(clockWidth * 10000), Math.round(clockHeight * 10000));
        ratio = [
            Math.round((clockWidth / factor) * 10000),
            Math.round((clockHeight / factor) * 10000)
        ];

        const mw = width * (1 - settings.paddingX * 2);
        const mh = height * (1 - settings.paddingY * 2);

        const scaleX = mw / clockWidth;
        const scaleY = mh / clockHeight;

        scale = Math.min(scaleX, scaleY);
    }

    let layout = $derived(clockLayouts[settings.layout] ?? clockLayouts[defaultSettings.layout]);
    let fontData = $derived(fonts[settings.font] ?? fonts[defaultSettings.font]);
    let hour = $derived($clock[settings.twelveHour ? 'h12' : 'h24']);

    $effect.pre(() => {
        browser && calculateSize(settings.paddingX, settings.paddingY);
    });
</script>

<div
    use:onresize={calculateSize}
    class="h-full w-full flex items-center justify-center overflow-hidden"
    bind:this={wrapperEl}
>
    <div style="transform: scale({scale});" use:onresize={calculateSize} bind:this={clockEl}>
        <layout.default {settings}>
            {#snippet h(scaleX = 1, scaleY = 1)}
                <div class="flex flex-row">
                    {#each hour as char}
                        <C
                            {char}
                            font={fontData}
                            primaryColor={settings.color}
                            secondaryColor={settings.secondaryColor}
                            {scaleX}
                            {scaleY}
                        />
                    {/each}
                </div>
            {/snippet}
            {#snippet m(scaleX = 1, scaleY = 1)}
                <div class="flex flex-row">
                    {#each $clock.min as char}
                        <C
                            {char}
                            font={fontData}
                            primaryColor={settings.color}
                            secondaryColor={settings.secondaryColor}
                            {scaleX}
                            {scaleY}
                        />
                    {/each}
                </div>
            {/snippet}
            {#snippet s(scaleX = 1, scaleY = 1)}
                <div class="flex flex-row" class:hidden={!settings.showSeconds}>
                    {#if settings.showSeconds}
                        {#each $clock.sec as char}
                            <C
                                {char}
                                font={fontData}
                                primaryColor={settings.color}
                                secondaryColor={settings.secondaryColor}
                                {scaleX}
                                {scaleY}
                            />
                        {/each}
                    {/if}
                </div>
            {/snippet}
            {#snippet a(scaleX = 1, scaleY = 1)}
                <div class="flex flex-row" class:hidden={!settings.showNight}>
                    {#if settings.showNight}
                        <C
                            char={$clock.pm ? 'P' : 'A'}
                            font={fontData}
                            primaryColor={settings.color}
                            secondaryColor={settings.secondaryColor}
                            {scaleX}
                            {scaleY}
                        />
                        <C
                            char="M"
                            font={fontData}
                            primaryColor={settings.color}
                            secondaryColor={settings.secondaryColor}
                            {scaleX}
                            {scaleY}
                        />
                    {/if}
                </div>
            {/snippet}
            {#snippet c(scaleX = 1, scaleY = 1)}
                <div class:hidden={settings.beforeMinutes === 'none'}>
                    {#if settings.beforeMinutes !== 'none'}
                        {@const visible =
                            settings.beforeMinutes !== 'space' &&
                            (!settings.blinkColon || $clock.blink)}
                        <C
                            char=":"
                            font={fontData}
                            primaryColor={visible ? settings.color : 'transparent'}
                            secondaryColor={settings.beforeMinutes === 'space'
                                ? 'transparent'
                                : settings.secondaryColor}
                            {scaleX}
                            {scaleY}
                        />
                    {/if}
                </div>
            {/snippet}
            {#snippet d(scaleX = 1, scaleY = 1)}
                <div class:hidden={settings.beforeSeconds === 'none' || !settings.showSeconds}>
                    {#if settings.beforeSeconds !== 'none'}
                        {@const invisible = settings.beforeSeconds === 'space'}
                        {@const blink = !settings.blinkColon || $clock.blink}
                        {@const isColon = settings.beforeSeconds === 'colon'}
                        <C
                            char={isColon ? ':' : '.'}
                            font={fontData}
                            primaryColor={invisible
                                ? 'transparent'
                                : !isColon
                                  ? settings.color
                                  : blink
                                    ? settings.color
                                    : 'transparent'}
                            secondaryColor={invisible ? 'transparent' : settings.secondaryColor}
                            {scaleX}
                            {scaleY}
                        />
                    {/if}
                </div>
            {/snippet}
        </layout.default>
    </div>
</div>
