<script lang="ts">
    import { quadIn, linear, quartIn } from 'svelte/easing';
    import type { EasingFunction, TransitionConfig } from 'svelte/transition';

    type $$Props = {
        chars: string[];
        char: string;
        easing?: EasingFunction;
        animationDuration?: number;

        '--counter-digit-width'?: string;
        '--counter-digit-height'?: string;
        '--counter-digit-text-color'?: string;
        '--counter-digit-font'?: string;
        '--counter-digit-font-size'?: string;
        '--counter-digit-separator'?: string;
        '--counter-digit-padding'?: string;
        '--counter-digit-justify'?: string;
        '--counter-digit-align'?: string;
        '--counter-digit-card-color'?: string;
        '--counter-digit-radius'?: string;
        '--counter-digit-bg'?: string;
    };

    export let chars: string[];
    export let char: string;

    export let easing = quadIn;
    export let animationDuration = 150;

    $: index = chars.indexOf(char);

    let _current = index;
    let _next = index;

    let flipDirection = 1;

    let easeFn = linear;

    let _duration = animationDuration;

    $: if (animationDuration < 0) animationDuration = 0;
    $: if (_next === _current && _next !== index) next();
    $: if (_next === undefined || _current === undefined) _next = _current = index;

    function capped(n: number) {
        return (n + chars.length) % chars.length;
    }

    function flip(
        _: HTMLElement,
        opts: { ease?: EasingFunction; duration?: number; delay?: number } = {}
    ): TransitionConfig {
        const ease = opts.ease ?? quadIn;

        return {
            duration: opts.duration ?? 150,
            delay: opts.delay ?? 0,
            css(t) {
                const eased = ease(t);
                const deg = 180 - eased * (flipDirection * 180);

                return `transform: rotateX(${deg}deg);`;
            }
        };
    }

    function dim(
        _: HTMLElement,
        opts: { ease?: EasingFunction; duration?: number; delay?: number; inverted?: boolean }
    ): TransitionConfig {
        const ease = opts.ease ?? quadIn;
        return {
            duration: opts.duration ?? 150,
            delay: opts.delay ?? 0,
            css(t, u) {
                const s = quartIn(opts.inverted ? t : u);
                return `filter: brightness(${1 - s * 0.5});`;
            }
        };
    }

    function sortval(n: number) {
        return Math.abs(n) + (n < 0 ? 0.5 : 0);
    }

    function next() {
        _current = _next;
        if (_next !== index) {
            const offsets = [index, index + chars.length, index - chars.length]
                .map((o) => o - _next)
                .sort((a, b) => sortval(a) - sortval(b));
            flipDirection = offsets[0] > 0 ? 1 : -1;
            _next = capped(_next + flipDirection);
            easeFn = _next === index ? easing : linear;
            _duration = easeFn === easing ? animationDuration : Math.floor(animationDuration / 2);
        }
    }
</script>

<div class="digit">
    {#key _next}
        <div
            class="digit-card"
            class:digit-top={flipDirection > 0}
            class:digit-bottom={flipDirection < 0}
            in:dim={{ ease: easeFn, duration: _duration, inverted: false }}
        >
            {chars[_next]}
        </div>
        <div
            class="digit-card"
            class:digit-top={flipDirection < 0}
            class:digit-bottom={flipDirection > 0}
            in:dim={{ ease: easeFn, duration: _duration, inverted: true }}
        >
            {chars[_current]}
        </div>
        <div class="digit-flip" in:flip={{ ease: easeFn, duration: _duration }} on:introend={next}>
            <div
                class="digit-card"
                class:digit-top={flipDirection < 0}
                class:digit-bottom={flipDirection > 0}
                in:dim={{ ease: easeFn, duration: _duration, inverted: false }}
            >
                {chars[_next]}
            </div>
            <div
                class="digit-card digit-back"
                class:digit-top={flipDirection > 0}
                class:digit-bottom={flipDirection < 0}
                in:dim={{ ease: easeFn, duration: _duration, inverted: true }}
            >
                {chars[_current]}
            </div>
        </div>
    {/key}
</div>

<style lang="postcss">
    .digit {
        @apply relative;
        width: var(--counter-digit-width, 48px);
        height: var(--counter-digit-height, 64px);
        color: var(--counter-digit-text-color, #dfe0df);
        font-family: var(--counter-digit-font, monospace), monospace;
        font-size: var(--counter-digit-font-size, 64px);
        perspective: 1000px;
        border-radius: var(--counter-digit-radius, 4px);
        background-color: var(--counter-digit-bg, #b78670);

        --counter-digit-calc-height: calc(
            var(--counter-digit-height, 64px) + var(--counter-digit-separator, 2px)
        );
        --counter-digit-clip-height: calc(var(--counter-digit-calc-height) / 2);

        .digit-card {
            @apply absolute flex h-full w-full flex-row items-center justify-center;
            padding: var(--counter-digit-padding, auto);
            justify-content: var(--counter-digit-justify, center);
            align-items: var(--counter-digit-align, center);
            background-color: var(--counter-digit-card-color, #402e32);
            border-radius: var(--counter-digit-radius, 4px);
        }

        .digit-flip {
            @apply relative h-full w-full;
            transition: transform 0s;
            transform-style: preserve-3d;

            & > div {
                -webkit-backface-visibility: hidden; /* Safari */
                backface-visibility: hidden;
            }

            .digit-back {
                transform: rotateX(180deg);
            }
        }

        .digit-top {
            clip-path: inset(0 0 var(--counter-digit-clip-height) 0);
        }

        .digit-bottom {
            clip-path: inset(var(--counter-digit-clip-height) 0 0 0);
        }
    }
</style>
