<script lang="ts" context="module">
    export const name = 'Compact';
</script>

<div class="flex flex-row">
    <div class="flex flex-row">
        <slot name="h" />
        <slot name="c" />
        <slot name="m" />
    </div>
    <div class="flex flex-col">
        <slot name="s" scaleX={0.5} scaleY={0.5} />
        <slot name="a" scaleX={0.5} scaleY={0.5} />
    </div>
</div>
