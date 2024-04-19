<script lang="ts">
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$page.status} {$page.error?.message} - Streamer Utilities</title>
</svelte:head>

<main class="container mx-auto prose dark:prose-invert prose-a:link py-2 md:py-6">
    <h1>{$page.status} {$page.error?.message}</h1>
</main>
