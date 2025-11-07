<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import { ModeWatcher } from "mode-watcher";
    import {setMode} from "mode-watcher";
    import MenuBar from "$lib/components/feature/MenuBar/MenuBar.svelte";
    import Sidebar from "$lib/components/feature/Sidebar.svelte";
    import Toolbar from "$lib/components/feature/Toolbar.svelte";
		import * as Resizable from "$lib/components/ui/resizable/index.js";
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		setMode("dark")
	});

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
			<Resizable.PaneGroup
				direction="horizontal"
				class="rounded-lg border"
			>
				<Resizable.Pane defaultSize={25} minSize={10}>
            <Sidebar {activeTab} {projectPath} />
				</Resizable.Pane>
				<Resizable.Handle />
				<Resizable.Pane minSize={10}>
					<main class="flex-1 overflow-auto w-full h-full">
							{@render children()}
					</main>
				</Resizable.Pane>
			</Resizable.PaneGroup>
    </div>
</div>
