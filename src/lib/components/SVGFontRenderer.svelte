<script lang="ts" context="module">
    const characters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', '.', 'A', 'P', 'M'];
</script>

<script lang="ts">
    import type { SVGNumberMetadata } from 'virtual:svg-numbers';

    export let font: SVGNumberMetadata & {
        url: string;
    };
    export let char: string;
    export let color: string;

    export let scaleX = 1;
    export let scaleY = 1;

    $: charWidth = font.width / 5;
    $: charHeight = font.height / 3;

    $: charIndex = characters.indexOf(char);

    $: charX = (charIndex % 5) * charWidth;
    $: charY = Math.floor(charIndex / 5) * charHeight;

    $: scaleChar = char === ':' ? font.colon ?? 1 : char === '.' ? font.dot ?? 1 : font.char ?? 1;

    $: containerWidth = charWidth * scaleX * scaleChar;
    $: containerHeight = charHeight * scaleY;

    $: offset = (charWidth * scaleX - containerWidth) / 2;
</script>

<div
    class="char-wrapper"
    style="--mask-image: url({font.url}); --mask-position: -{charX}px -{charY}px; --mask-repeat: no-repeat; width: {containerWidth}px; height: {containerHeight}px"
>
    <div
        class="char"
        style="margin-left: -{offset}px; transform: scale({scaleX}, {scaleY}); transform-origin: top left; background-color: {color}; width: {charWidth}px; height: {charHeight}px"
    />
</div>

<style lang="postcss">
    .char-wrapper {
        @apply overflow-visible;
    }
    .char {
        @apply pointer-events-none;
        mask-image: var(--mask-image);
        mask-position: var(--mask-position);
        mask-repeat: var(--mask-repeat);
        -webkit-mask-image: var(--mask-image);
        -webkit-mask-position: var(--mask-position);
        -webkit-mask-repeat: var(--mask-repeat);
    }
</style>
