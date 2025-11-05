<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import { ModeWatcher } from "mode-watcher";
    import {setMode} from "mode-watcher";
    import MenuBar from "$lib/components/feature/menubar/MenuBar.svelte";
    import Sidebar from "$lib/components/feature/Sidebar.svelte";
    import Toolbar from "$lib/components/feature/Toolbar.svelte";

	let { children } = $props();

    setMode("dark")
    function handleTabChange(tab: 'files' | 'git' | 'settings') {
        activeTab = tab;
    }

    let activeTab = $state('files');
    const projectPath = 'C:/Users/Kevin/WebstormProjects/svide';
</script>

<ModeWatcher />
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="h-screen flex flex-col bg-gray-950 text-white">
    <MenuBar />

    <div class="flex flex-1 overflow-hidden">
        <Toolbar {activeTab} onTabChange={handleTabChange} />
        <Sidebar {activeTab} {projectPath} />

        <main class="flex-1 overflow-auto">
            {@render children()}
        </main>
    </div>
</div>

{@render children()}
