<script lang="ts">
    import { json, local } from '$lib/stores';

    type BuckshotHelperData = {
        total: number;
        live: number;
        used: ('live' | 'blank' | null)[];
        index: number;
    };

    export const data = json<BuckshotHelperData>(local('game/buckshot'), () => ({
        total: 7,
        live: 3,
        used: new Array(7).fill(null),
        index: 0
    }));

    $: if ($data.live >= $data.total) $data.live = $data.total - 1;
    $: shotLeft = $data.used.filter((v) => v === null).length;
    $: liveLeft = $data.live - $data.used.filter((v) => v === 'live').length;
    $: blankLeft = $data.total - $data.live - $data.used.filter((v) => v === 'blank').length;

    $: current = $data.used[$data.index];
    $: canBeLive = current === 'live' || liveLeft > 0;
    $: canBeBlank = current === 'blank' || blankLeft > 0;

    $: liveChance = current === 'live' ? 100 : shotLeft ? (liveLeft / shotLeft) * 100 : 0;
    $: blankChance = current === 'blank' ? 100 : shotLeft ? (blankLeft / shotLeft) * 100 : 0;

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
    <div class="not-prose form-group">
        <div class="form-field">
            <label class="form-label" for="total">Total Shots</label>
            <div class="input input-solid max-w-full flex flex-row items-center justify-center">
                <span class="mr-4">{$data.total}</span>
                <input
                    id="total"
                    type="range"
                    class="range flex-grow max-w-full"
                    bind:value={$data.total}
                    on:input={() => {
                        $data.live = Math.floor($data.total / 2);
                        $data.used = new Array($data.total).fill(null);
                        $data.index = 0;
                    }}
                    min="2"
                    max="8"
                />
            </div>
        </div>
        <div class="form-field">
            <label class="form-label" for="live">Total Live Shots</label>
            <div class="input input-solid max-w-full flex flex-row items-center justify-center">
                <span class="mr-4">{$data.live}</span>
                <input
                    id="live"
                    type="range"
                    class="range flex-grow max-w-full"
                    bind:value={$data.live}
                    on:change={() => ($data.used = new Array($data.total).fill(null))}
                    min="1"
                    max={$data.total - 1}
                    disabled={$data.total <= 2}
                />
            </div>
        </div>
        <div class="form-field">
            <span class="form-label">Shot History</span>
            <div class="flex flex-row flex-wrap gap-3">
                {#each range($data.total) as index}
                    {@const current = $data.used[index]}
                    {@const canBeLive = current === 'live' || liveLeft > 0}
                    {@const canBeBlank = current === 'blank' || blankLeft > 0}
                    {@debug current, canBeLive, canBeBlank}
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
            <div class="flex flex-row flex-wrap gap-2 mt-6">
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
                    on:click={() => {
                        $data.used = new Array($data.total).fill(null);
                        $data.index = 0;
                    }}
                >
                    Clear
                </button>
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
