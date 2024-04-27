<script lang="ts">
    import { page } from '$app/stores';
    import { PUBLIC_VERSION, PUBLIC_GITHUB_REPO } from '$env/static/public';
    import {
        Hugeicon,
        Github01Icon,
        Menu01Icon,
        Calendar03Icon,
        Settings04Icon,
        InformationCircleIcon,
        Clock01Icon,
        GameController03Icon
    } from 'hugeicons-svelte';

    function getGroup(path: string) {
        const match = /^\/\(main\)\/\(([^\)]+)\)/.exec(path);
        return match?.[1];
    }

    $: group = getGroup($page.route.id ?? '');
</script>

<div class="flex flex-row md:gap-10">
    <div class="md:w-full md:max-w-[18rem]">
        <input type="checkbox" id="sidebar-mobile-fixed" class="sidebar-state" />
        <label for="sidebar-mobile-fixed" class="sidebar-overlay"></label>
        <aside
            class="sidebar sidebar-fixed-left sidebar-mobile h-full justify-start max-md:fixed max-md:-translate-x-full"
        >
            <section class="sidebar-title items-center p-4">
                <Hugeicon icon={Settings04Icon} class="p-0.5" size="42" />
                <div class="flex flex-col">
                    <span>Streamer Utilities</span>
                    <span class="text-xs font-normal text-content2 truncate">{PUBLIC_VERSION}</span>
                </div>
            </section>
            <section class="sidebar-content">
                <nav class="menu rounded-md">
                    <section class="menu-section px-4">
                        <ul class="menu-items">
                            <li class="contents">
                                <a href="/" class="menu-item" class:menu-active={group === 'about'}>
                                    <Hugeicon
                                        icon={InformationCircleIcon}
                                        class="h-5 w-5 opacity-75"
                                    />
                                    <span>About</span>
                                </a>
                            </li>
                        </ul>
                    </section>
                    <section class="menu-section px-4 pt-6">
                        <span class="menu-title">Streaming Widgets</span>
                        <ul class="menu-items">
                            <li class="contents">
                                <a
                                    href="/clock"
                                    class="menu-item"
                                    class:menu-active={group === 'clock'}
                                >
                                    <Hugeicon icon={Clock01Icon} class="h-5 w-5 opacity-75" />
                                    <span>Clock</span>
                                </a>
                            </li>
                            <ul class="menu-items">
                                <li class="contents">
                                    <a
                                        href="/count-down"
                                        class="menu-item"
                                        class:menu-active={group === 'cd'}
                                    >
                                        <Hugeicon
                                            icon={Calendar03Icon}
                                            class="h-5 w-5 opacity-75"
                                        />
                                        <span>Count down</span>
                                    </a>
                                </li>
                            </ul>
                        </ul>
                    </section>
                    <section class="menu-section px-4 pt-6">
                        <span class="menu-title">Misc</span>
                        <ul class="menu-items">
                            <li class="contents">
                                <a
                                    href="/game-helpers"
                                    class="menu-item"
                                    class:menu-active={group === 'game'}
                                >
                                    <Hugeicon
                                        icon={GameController03Icon}
                                        class="h-5 w-5 opacity-75"
                                    />
                                    <span>Game Helper</span>
                                </a>
                            </li>
                        </ul>
                    </section>
                </nav>
            </section>
            <section class="sidebar-footer justify-end bg-gray-2 py-2">
                <div class="divider my-0"></div>
                <nav class="menu rounded-md">
                    <section class="menu-section px-4">
                        <ul class="menu-items">
                            <ul class="menu-items">
                                <li class="contents">
                                    <a href={PUBLIC_GITHUB_REPO} target="_blank" class="menu-item">
                                        <Hugeicon icon={Github01Icon} class="h-5 w-5 opacity-75" />
                                        <span>Source Code</span>
                                    </a>
                                </li>
                            </ul>
                        </ul>
                    </section>
                </nav>
            </section>
        </aside>
    </div>
    <div class="flex w-full flex-col p-4 gap-2">
        <div class="w-fit sticky top-2 z-30 pointer-events-none">
            <label for="sidebar-mobile-fixed" class="btn btn-circle md:hidden pointer-events-auto">
                <Hugeicon icon={Menu01Icon} />
            </label>
        </div>
        <slot />
    </div>
</div>
