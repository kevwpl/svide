<script lang="ts">
	import { X } from '@lucide/svelte';
	import { editorStore } from '$lib/editorStore';

	const state = $derived($editorStore);
</script>

<div class="flex border-b border-gray-700 bg-gray-900 overflow-x-auto">
	{#each state.tabs as tab (tab.id)}
		<div
			class={`flex items-center gap-2 px-4 py-2 border-r border-gray-700 cursor-pointer transition-colors ${
				state.activeTabId === tab.id
					? 'bg-gray-800 text-white'
					: 'bg-gray-900 text-gray-400 hover:bg-gray-800'
			}`}
			onclick={() => editorStore.setActiveTab(tab.id)}
		>
			<span class="text-sm">{tab.name}</span>
			{#if tab.isDirty}
				<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
			{/if}
			<button
				onclick={(e) => {
					e.stopPropagation();
					editorStore.closeTab(tab.id);
				}}
				class="hover:bg-gray-700 rounded p-0.5"
			>
				<X size={14} />
			</button>
		</div>
	{/each}
</div>