<script lang="ts">
    import { tick } from 'svelte';
    import { json, local } from '$lib/stores';

    type BuckshotHelperData = {
        total: number;
        live: number;
        used: ('live' | 'blank' | null)[];
        index: number;
    };

    const defaultData = () => ({
        total: 7,
        live: 3,
        used: new Array(7).fill(null),
        index: 0
    });

    export const data = json<BuckshotHelperData>(local('game/buckshot'), defaultData);

    $: if ($data.live >= $data.total) $data.live = $data.total - 1;
    $: shotLeft = $data.used.filter((v) => v === null).length;
    $: liveLeft = $data.live - $data.used.filter((v) => v === 'live').length;
    $: blankLeft = $data.total - $data.live - $data.used.filter((v) => v === 'blank').length;

    $: current = $data.used[$data.index];
    $: canBeLive = current === 'live' || liveLeft > 0;
    $: canBeBlank = current === 'blank' || blankLeft > 0;

    $: liveChance = current === 'live' ? 100 : shotLeft ? (liveLeft / shotLeft) * 100 : 0;
    $: blankChance = current === 'blank' ? 100 : shotLeft ? (blankLeft / shotLeft) * 100 : 0;

    $: if ($data.used.length !== $data.total) {
        $data.used = new Array($data.total).fill(null);
        $data.live = Math.floor($data.total / 2);
        $data.index = 0;
    }

    $: if (liveLeft < 0 || blankLeft < 0) clear();

    async function clear() {
        await tick();
        $data.used = new Array($data.total).fill(null);
        $data.index = 0;
    }

    function* range(n: number) {
        for (let i = 0; i < n; i++) yield i;
    }
</script>

<svelte:head>
    <title>Buckshot Roulette Helper - Streamer Utilities</title>
    <meta
        name="description"
        content="Helper for Buckshot Roulette, help to calculate probability for shots."
    />
</svelte:head>

<main class="container mx-auto prose dark:prose-invert prose-a:link py-2 md:py-6">
    <h1>Buckshot Roulette Helper</h1>
    <div class="not-prose form-group mb-12">
        <div class="form-field">
            <label class="form-label" for="total">Total Shots</label>
            <div class="pagination pagination-compact w-full grid grid-cols-8">
                <input type="radio" id="total-1" disabled />
                <label for="total-1" class="btn"> 1 </label>
                {#each range(7) as i}
                    <input id="total-{i + 2}" type="radio" value={i + 2} bind:group={$data.total} />
                    <label for="total-{i + 2}" class="btn">
                        {i + 2}
                    </label>
                {/each}
            </div>
        </div>
        <div class="form-field">
            <label class="form-label" for="live">Total Live Shots</label>
            <div class="pagination pagination-compact w-full grid grid-cols-8">
                {#each range(7) as i}
                    <input
                        id="live-{i + 1}"
                        type="radio"
                        value={i + 1}
                        bind:group={$data.live}
                        disabled={i + 1 > $data.total - 1}
                    />
                    <label for="live-{i + 1}" class="btn">
                        {i + 1}
                    </label>
                {/each}
                <input type="radio" id="live-8" disabled />
                <label for="live-8" class="btn"> 8 </label>
            </div>
        </div>
        <div class="form-field">
            <span class="form-label">Controls</span>
            <div class="flex flex-row flex-wrap gap-2">
                <button
                    class="btn w-24 btn-solid-error"
                    disabled={!canBeLive}
                    on:click={() => {
                        $data.used[$data.index] = 'live';
                        if ($data.index < $data.total - 1) $data.index++;
                    }}
                >
                    Live
                </button>
                <button
                    class="btn w-24 btn-solid-primary"
                    disabled={!canBeBlank}
                    on:click={() => {
                        $data.used[$data.index] = 'blank';
                        if ($data.index < $data.total - 1) $data.index++;
                    }}
                >
                    Blank
                </button>
                <button
                    class="btn w-24 btn-solid-secondary"
                    disabled={$data.index === 0}
                    on:click={() => {
                        $data.used[$data.index] = null;
                        $data.index--;
                    }}
                >
                    Back
                </button>
                <button
                    class="btn w-24 btn-solid"
                    disabled={$data.used.every((v) => v === null)}
                    on:click={() => {
                        $data.used = new Array($data.total).fill(null);
                        $data.index = 0;
                    }}
                >
                    Clear
                </button>
            </div>
        </div>
        <div class="form-field">
            <span class="form-label">Shot History</span>
            <div class="flex flex-row flex-wrap gap-3">
                {#each range($data.total) as index}
                    {@const current = $data.used[index]}
                    {@const canBeLive = current === 'live' || liveLeft > 0}
                    {@const canBeBlank = current === 'blank' || blankLeft > 0}
                    <div class="flex flex-col justify-center items-center gap-1">
                        <span class="badge" class:badge-secondary={$data.index === index}>
                            Shot #{index + 1}
                        </span>
                        <select
                            class="select pr-10"
                            class:select-solid={current === null}
                            class:select-solid-error={current === 'live'}
                            class:select-solid-primary={current === 'blank'}
                            bind:value={$data.used[index]}
                        >
                            <option value={null}>-</option>
                            <option value="live" disabled={!canBeLive}>Live</option>
                            <option value="blank" disabled={!canBeBlank}>Blank</option>
                        </select>
                    </div>
                {/each}
            </div>
        </div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-3">
            <div class="form-field">
                <span class="form-label">Live Shot Left</span>
                <input class="input input-solid max-w-full" value={liveLeft} readonly />
            </div>
            <div class="form-field">
                <span class="form-label">Blank Shot Left</span>
                <input class="input input-solid max-w-full" value={blankLeft} readonly />
            </div>
            <div class="form-field">
                <span class="form-label">Live Shot Chance</span>
                <input
                    class="input input-solid max-w-full"
                    value="{liveChance.toFixed(2)}%"
                    readonly
                />
            </div>
            <div class="form-field">
                <span class="form-label">Blank Shot Chance</span>
                <input
                    class="input input-solid max-w-full"
                    value="{blankChance.toFixed(2)}%"
                    readonly
                />
            </div>
        </div>
    </div>
</main>
