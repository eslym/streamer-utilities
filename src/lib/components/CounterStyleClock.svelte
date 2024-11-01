<script lang="ts" module>
    type ClockProps = Omit<ComponentProps<typeof Counter>, 'data'> & {
        twelveHour: boolean;
        showSeconds: boolean;
    };

    type ClockCSSVars = {
        [K in keyof ClockProps]?: K extends `--${string}` ? ClockProps[K] : never;
    };

    export type ClockSettings = {
        _v?: number;
        googleFont: boolean;
        twelveHour: boolean;
        showSeconds: boolean;
        background: string;
        radius: number;
        padding: Sides;
        spacing: number;
        animationDuration: number;
        digitColor: string;
        digitFont: string;
        digitFontSize: number;
        digitWidth: number;
        digitHeight: number;
        digitBackground: string;
        digitRadius: number;
        digitPadding: Sides;
        digitAlign: AlignmentNumber;
        digitSpacing: number;
        digitDivider: number;
        digitDividerColor: string;
    };

    export const defaultSettings: ClockSettings = {
        _v: 1,
        googleFont: true,
        twelveHour: true,
        showSeconds: false,
        background: '#f49b72',
        radius: 8,
        padding: {
            mode: 1,
            sides: [12]
        },
        spacing: 12,
        animationDuration: 150,
        digitColor: '#dfe0df',
        digitFont: 'Road Rage',
        digitFontSize: 64,
        digitWidth: 48,
        digitHeight: 64,
        digitBackground: '#402e32',
        digitRadius: 4,
        digitPadding: {
            mode: 1,
            sides: [8]
        },
        digitAlign: '5',
        digitSpacing: 4,
        digitDivider: 2,
        digitDividerColor: '#b78670'
    };

    const propMap: Record<Exclude<keyof ClockSettings, '_v'>, string> = {
        googleFont: 'g',
        twelveHour: '12',
        showSeconds: 's',
        background: 'cb',
        radius: 'cr',
        padding: 'cp',
        spacing: 'cg',
        animationDuration: 'cd',
        digitColor: 'dc',
        digitFont: 'df',
        digitFontSize: 'ds',
        digitWidth: 'dw',
        digitHeight: 'dh',
        digitBackground: 'db',
        digitRadius: 'dr',
        digitPadding: 'dp',
        digitAlign: 'da',
        digitSpacing: 'dg',
        digitDivider: 'dd',
        digitDividerColor: 'dC'
    };

    const mapProp = Object.fromEntries(Object.entries(propMap).map(([k, v]) => [v, k]));

    export function encodeSettings(settings: ClockSettings): URLSearchParams {
        const params = new URLSearchParams();
        for (const [prop, value] of Object.entries(settings)) {
            if (!(prop in propMap)) continue;
            if (value === (defaultSettings as any)[prop]) continue;
            const key = (propMap as any)[prop];
            if (!key) continue;
            if (prop === 'padding' || prop === 'digitPadding') {
                const sides = (value as Sides).sides.join('|');
                const def = (defaultSettings as any)[prop].sides.join('|');
                if (sides === def) continue;
                params.set(key, sides);
                continue;
            }
            params.set(key, String(value));
        }
        return params;
    }

    export function decodeSettings(params: URLSearchParams): ClockSettings {
        const settings = { ...defaultSettings };
        for (const [key, value] of params) {
            if (!(key in mapProp)) continue;
            const prop = mapProp[key];
            if (prop === 'padding' || prop === 'digitPadding') {
                settings[prop] = decodeSides(value);
                continue;
            }
            const def = (defaultSettings as any)[prop];
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
        return settings;
    }

    export function toProps(settings: ClockSettings): {
        props: Omit<ClockProps, `--${string}`>;
        styles: ClockCSSVars;
    } {
        const alignment = mapAlign(settings.digitAlign);
        return {
            props: {
                twelveHour: settings.twelveHour,
                showSeconds: settings.showSeconds,
                animationDuration: settings.animationDuration
            },
            styles: {
                '--counter-bg': settings.background,
                '--counter-radius': `${settings.radius}px`,
                '--counter-padding': settings.padding.sides.map((p) => `${p}px`).join(' '),
                '--counter-group-gap': `${settings.spacing}px`,
                '--counter-digit-text-color': settings.digitColor,
                '--counter-digit-font': JSON.stringify(settings.digitFont),
                '--counter-digit-font-size': `${settings.digitFontSize}px`,
                '--counter-digit-width': `${settings.digitWidth}px`,
                '--counter-digit-height': `${settings.digitHeight}px`,
                '--counter-digit-radius': `${settings.digitRadius}px`,
                '--counter-digit-padding': settings.digitPadding.sides
                    .map((p) => `${p}px`)
                    .join(' '),
                '--counter-digit-justify': alignment[0],
                '--counter-digit-align': alignment[1],
                '--counter-digit-gap': `${settings.digitSpacing}px`,
                '--counter-digit-separator': `${settings.digitDivider}px`,
                '--counter-digit-card-color': settings.digitBackground,
                '--counter-digit-bg': settings.digitDividerColor
            }
        };
    }
</script>

<script lang="ts">
    import Counter from '$lib/components/counter/Counter.svelte';
    import {
        decodeSides,
        mapAlign,
        numbers,
        parseBoolean,
        type AlignmentNumber,
        type Sides
    } from '$lib/utils';
    import { clock, type Clock } from '$lib/clock';
    import type { ComponentProps } from 'svelte';

    let { twelveHour, showSeconds, animationDuration = 150 }: ClockProps = $props();

    function clockGroup(clock: Clock, twelve: boolean, seconds: boolean) {
        const hrs = clock[twelve ? 'h12' : 'h24'].split('');
        const mins = clock.min.split('');
        const secs = clock.sec.split('');
        return [
            [
                [hrs[0], numbers.slice(0, 3)],
                [hrs[1], numbers]
            ],
            [
                [mins[0], numbers.slice(0, 6)],
                [mins[1], numbers]
            ],
            seconds && [
                [secs[0], numbers.slice(0, 6)],
                [secs[1], numbers]
            ],
            twelve && [
                [clock.pm ? 'P' : 'A', ['A', 'P']],
                ['M', ['M']]
            ]
        ].filter(Boolean) as [string, string[]][][];
    }
</script>

<Counter data={clockGroup($clock, twelveHour, showSeconds)} {animationDuration} />
