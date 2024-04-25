<script lang="ts" context="module">
    export const name = 'Compact 2';
</script>

<div class="flex flex-col">
    <div class="flex flex-row">
        <slot name="h" />
        <slot name="c" />
        <slot name="m" />
    </div>
    <div class="flex flex-row w-full justify-between">
        <slot name="s" scaleX={1} scaleY={0.25} />
        <slot name="a" scaleX={1} scaleY={0.25} />
    </div>
</div>
