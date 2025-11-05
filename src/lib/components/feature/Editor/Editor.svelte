<script lang="ts">
	import { onMount } from 'svelte';
	import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
	import { editorStore } from '$lib/editorStore';
	import EditorTabs from './EditorTabs.svelte';

	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	let editorContainer: HTMLDivElement;
	let editor: any = $state(null);
	let monaco: any = null;
	let currentPath = $state<string | null>(null);

	const state = $derived($editorStore);
	const activeTab = $derived(
		state.tabs.find((tab) => tab.id === state.activeTabId)
	);

	$effect(() => {
		if (activeTab && editor && activeTab.path !== currentPath) {
			loadFile(activeTab.path);
		}
	});

	onMount(async () => {
		self.MonacoEnvironment = {
			getWorker(_: string, label: string) {
				switch (label) {
					case 'json':
						return new jsonWorker();
					case 'css':
					case 'scss':
					case 'less':
						return new cssWorker();
					case 'html':
					case 'handlebars':
					case 'razor':
						return new htmlWorker();
					case 'typescript':
					case 'javascript':
						return new tsWorker();
					default:
						return new editorWorker();
				}
			},
		};

		const monacoModule = await import('monaco-editor');
		monaco = monacoModule.default || monacoModule;

		editor = monaco.editor.create(editorContainer, {
			value: '',
			language: 'typescript',
			theme: 'vs-dark',
			automaticLayout: true,
			minimap: { enabled: false },
			fontSize: 14,
			fontFamily: 'Fira Code, Consolas, monospace',
		});

		editor.onDidChangeModelContent(() => {
			if (state.activeTabId && currentPath) {
				editorStore.setTabDirty(state.activeTabId, true);
			}
		});

		return () => editor?.dispose();
	});

	async function loadFile(path: string) {
		if (!editor) return;

		try {
			const content = await readTextFile(path);
			const language = getLanguageFromPath(path);
			const model = editor.getModel();

			if (model && monaco) {
				monaco.editor.setModelLanguage(model, language);
			}

			editor.setValue(content);
			currentPath = path;

			if (state.activeTabId) {
				editorStore.setTabDirty(state.activeTabId, false);
			}
		} catch (error) {
			console.error(`Error loading file ${path}:`, error);
		}
	}

	async function saveFile() {
		if (!editor || !activeTab) return;

		try {
			const content = editor.getValue();
			await writeTextFile(activeTab.path, content);
			editorStore.setTabDirty(activeTab.id, false);
		} catch (error) {
			console.error(`Error saving file:`, error);
		}
	}

	function getLanguageFromPath(path: string): string {
		const extension = path.split('.').pop()?.toLowerCase();
		const languageMap: Record<string, string> = {
			ts: 'typescript',
			tsx: 'typescript',
			js: 'javascript',
			jsx: 'javascript',
			svelte: 'html',
			vue: 'html',
			json: 'json',
			html: 'html',
			css: 'css',
			scss: 'scss',
			less: 'less',
			py: 'python',
			rs: 'rust',
			go: 'go',
			java: 'java',
			cpp: 'cpp',
			c: 'c',
			php: 'php',
			rb: 'ruby',
			sql: 'sql',
			xml: 'xml',
			yaml: 'yaml',
			yml: 'yaml',
			sh: 'shell',
			bash: 'shell',
			dockerfile: 'dockerfile',
			md: 'markdown',
		};

		return languageMap[extension || ''] || 'plaintext';
	}
</script>

<div class="flex flex-col h-full bg-gray-950">
	<EditorTabs />

	<div
		class="flex items-center justify-between border-b border-gray-700 px-4 py-2 bg-gray-900"
	>
		{#if activeTab}
			<span class="text-sm text-gray-400">{activeTab.name}</span>
			<button
				onclick={saveFile}
				class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
			>
				Save
			</button>
		{:else}
			<span class="text-sm text-gray-500">No file selected</span>
		{/if}
	</div>

	<div bind:this={editorContainer} class="flex-1" class:hidden={!activeTab}>
	</div>

	{#if !activeTab}
		<div class="flex items-center justify-center h-full text-gray-500">
			<p>Select a file to edit</p>
		</div>
	{/if}
</div>