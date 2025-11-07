<script lang="ts">
	import { onMount } from 'svelte';
	import { editorStore } from '$lib/editorStore';
	import EditorTabs from './EditorTabs.svelte';
	import { initializeMonaco, createEditor } from '$lib/monacoSetup';
	import { loadFile, saveFile } from '$lib/fileOperations';
	import { setupShortcuts } from '$lib/shortcuts';

	let editorContainer: HTMLDivElement;
	let editor: any = $state(null);
	let monaco: any = null;
	let currentPath = $state<string | null>(null);
	let shortcuts: any = null;

    function ensureFontsLoaded(callback) {
        document.fonts.ready.then(() => {
                monaco.editor.remeasureFonts();
                callback();
        });
    }

	const state = $derived($editorStore);
	const activeTab = $derived(
		state.tabs.find((tab) => tab.id === state.activeTabId)
	);

	$effect(() => {
		if (activeTab && editor && activeTab.path !== currentPath) {
			saveCurrentScrollPosition();
			handleLoadFile(activeTab.path);
		}
	});

	function saveCurrentScrollPosition() {
		if (!editor || !currentPath) return;

		const position = editor.getPosition();
		if (position) {
			const currentTab = state.tabs.find((t) => t.path === currentPath);
			if (currentTab) {
				editorStore.setTabScrollPosition(currentTab.id, {
					lineNumber: position.lineNumber,
					column: position.column,
				});
			}
		}
	}

	async function handleLoadFile(path: string) {
		if (!editor) return;

		try {
			await loadFile(editor, monaco, path);
			currentPath = path;

			if (state.activeTabId) {
				editorStore.setTabDirty(state.activeTabId, false);

				const tab = state.tabs.find((t) => t.id === state.activeTabId);
				if (tab?.scrollPosition) {
					editor.setPosition(tab.scrollPosition);
					editor.revealPositionInCenter(tab.scrollPosition);
				}
			}
		} catch (error) {
			console.error(`Error loading file ${path}:`, error);
		}
	}

	async function handleSaveFile() {
		if (!editor || !activeTab) return;

		try {
			const content = editor.getValue();
			await saveFile(activeTab.path, content);
			editorStore.setTabDirty(activeTab.id, false);
		} catch (error) {
			console.error(`Error saving file:`, error);
		}
	}

	onMount(async () => {
		monaco = await initializeMonaco();
		editor = createEditor(editorContainer, monaco);

		editor.onDidChangeModelContent(() => {
			if (state.activeTabId && currentPath) {
				editorStore.setTabDirty(state.activeTabId, true);
			}
		});

		shortcuts = setupShortcuts();
		shortcuts.register(['Control', 's'], () => handleSaveFile());

		return () => {
			saveCurrentScrollPosition();
			editor?.dispose();
			shortcuts?.destroy();
		};
	});
</script>

<div class="flex flex-col h-full bg-background">
	<EditorTabs />
	<div bind:this={editorContainer} class="flex-1" class:hidden={!activeTab}>
	</div>

	{#if !activeTab}
		<div class="flex items-center justify-center h-full text-gray-500">
			<p>Select a file to edit</p>
		</div>
	{/if}
</div>