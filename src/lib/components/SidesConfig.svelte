<script lang="ts" module>
    let globalId = 0;
</script>

<script lang="ts">
    import type { Sides } from '$lib/utils';

    interface Props {
        sides: Sides;
        defaultSides: Sides;
    }

    let { sides: outSides = $bindable(), defaultSides }: Props = $props();

    let _sides = $state(outSides);

    const id = globalId++;

    export const modeMap = {
        1: {
            name: 'All',
            sides: ['All']
        },
        2: {
            name: '2 Sides',
            sides: ['Vertical', 'Horizontal']
        },
        4: {
            name: '4 Sides',
            sides: ['Top', 'Right', 'Bottom', 'Left']
        }
    };

    export function syncSides(..._: any[]) {
        if (_sides.mode === _sides.sides.length) return;
        if (_sides.sides.length > _sides.mode)
            _sides = { mode: _sides.mode, sides: _sides.sides.slice(0, _sides.mode) };
        const expand =
            defaultSides.mode === 1
                ? new Array(4).fill(defaultSides.sides[0])
                : defaultSides.mode === 2
                  ? [0, 1, 0, 1].map((i) => defaultSides.sides[i])
                  : defaultSides.sides;
        _sides = {
            mode: _sides.mode,
            sides: _sides.sides.concat(expand.slice(_sides.sides.length, _sides.mode))
        };
    }

    $effect.pre(() => {
        syncSides(_sides, defaultSides);
        outSides = _sides;
    });
</script>

<div class="form-field">
    <span class="form-label">Mode</span>
    <div class="pagination pagination-compact max-w-full w-full flex flex-row">
        <input id="sides-{id}-mode-1" type="radio" value={1} bind:group={_sides.mode} />
        <label for="sides-{id}-mode-1" class="btn flex-grow">
            {modeMap[1].name}
        </label>
        <input id="sides-{id}-mode-2" type="radio" value={2} bind:group={_sides.mode} />
        <label for="sides-{id}-mode-2" class="btn flex-grow">
            {modeMap[2].name}
        </label>
        <input id="sides-{id}-mode-4" type="radio" value={4} bind:group={_sides.mode} />
        <label for="sides-{id}-mode-4" class="btn flex-grow">
            {modeMap[4].name}
        </label>
    </div>
</div>
<div
    class="grid gap-x-2 gap-y-3"
    class:grid-cols-1={_sides.mode === 1}
    class:grid-cols-2={_sides.mode > 1}
>
    {#each _sides.sides as side, i}
        <div class="form-field">
            <label class="form-label" for="sides-{id}-side-{i}">
                {modeMap[_sides.mode].sides[i]}
            </label>
            <input
                id="sides-{id}-side-{i}"
                type="number"
                class="input input-solid max-w-full"
                bind:value={_sides.sides[i]}
            />
        </div>
    {/each}
</div>
