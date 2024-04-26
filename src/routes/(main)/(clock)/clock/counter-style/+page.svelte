<script lang="ts">
    import Counter from '$lib/components/counter/Counter.svelte';
    import { numbers } from '$lib/utils';
    import { clock, type Clock } from '$lib/clock';

    function clockGroup(clock: Clock) {
        const hrs = clock.h12.split('');
        const mins = clock.min.split('');
        const secs = clock.sec.split('');
        return [
            [
                [hrs[0], numbers.slice(0, 2)],
                [hrs[1], numbers]
            ],
            [
                [mins[0], numbers.slice(0, 6)],
                [mins[1], numbers]
            ],
            [
                [secs[0], numbers.slice(0, 6)],
                [secs[1], numbers]
            ],
            [
                [clock.pm ? 'P' : 'A', ['A', 'P']],
                ['M', ['M']]
            ]
        ] as [string, string[]][][];
    }
</script>

<svelte:head>
    <title>Counter Style Clock - Streamer Utitilies</title>
    <meta name="description" content="A clock that uses a counter style to display the time." />
</svelte:head>

<Counter data={clockGroup($clock)} />
