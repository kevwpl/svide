<script lang="ts">
	import { X } from '@lucide/svelte';
	import { editorStore } from '$lib/editorStore';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { getFileIcon } from '$lib/iconService';

	let draggedId: string | null = null;

	const state = $derived($editorStore);

	function handleDragStart(e: DragEvent, tabId: string) {
		draggedId = tabId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDrop(e: DragEvent, targetId: string) {
		e.preventDefault();
		if (draggedId && draggedId !== targetId) {
			editorStore.reorderTabs(draggedId, targetId);
		}
		draggedId = null;
	}

	function handleDragEnd() {
		draggedId = null;
	}
</script>

<div class="flex border-b-border bg-background overflow-x-auto">
	{#each state.tabs as tab (tab.id)}
		{@const iconPathPromise = getFileIcon(tab.name)}
		{#await iconPathPromise then iconFile}
			<div
				role="button"
				tabindex="0"
				draggable="true"
				ondragstart={(e) => handleDragStart(e, tab.id)}
				ondragover={handleDragOver}
				ondrop={(e) => handleDrop(e, tab.id)}
				ondragend={handleDragEnd}
				class="cursor-grab active:cursor-grabbing"
			>
				<Button
					variant="ghost"
					class={`rounded-none flex items-center pr-2 select-none ${
						draggedId === tab.id ? 'opacity-50' : ''
					} ${
						tab.id === state.activeTabId
							? 'bg-border text-white'
							: 'bg-background text-muted-foreground'
					}`}
					onclick={() => editorStore.setActiveTab(tab.id)}
				>
					{#if tab.isDirty}
						<Badge class="w-2 h-2 px-0.5 grounded-full bg-primary" />
						<span class="italic flex items-center">
							<img src={iconFile} alt="" class="size-4 mr-2" />
							{tab.name}
						</span>
					{:else}
						<span class="flex items-center">
							<img src={iconFile} alt="" class="size-4 mr-2" />
							{tab.name}
						</span>
					{/if}
					<Button
						onclick={(e) => {
							e.stopPropagation();
							editorStore.closeTab(tab.id);
						}}
						variant="ghost"
						class="size-6 p-1 ml-2"
					>
						<X size={16} />
					</Button>
				</Button>
			</div>
		{/await}
	{/each}
</div>