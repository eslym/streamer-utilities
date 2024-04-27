<script lang="ts" context="module">
    const googleFontURL = new URL(`https://fonts.googleapis.com/css2`);
</script>

<script lang="ts">
    export let families: string[];
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    {#each families as family}
        <link rel="stylesheet" href={googleFontURL.to({ family, display: 'swap' })} />
    {/each}
</svelte:head>
