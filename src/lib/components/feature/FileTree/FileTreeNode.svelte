<script lang="ts">
	import * as TreeView from '$lib/components/ui/tree-view';
	import { editorStore } from '$lib/editorStore';
	import { getFileIcon } from '$lib/iconService';
	import { ChevronDown, ChevronRight, Folder, FolderOpen } from '@lucide/svelte';
	let {
		entries,
	}: {
		entries: Array<{
			name: string;
			path: string;
			isDirectory: boolean;
			children?: any[];
			isOpen: boolean;
		}>;
	} = $props();
</script>

{#each entries as entry}
	{#if entry.isDirectory}
		<TreeView.Folder name={entry.name} bind:open={entry.isOpen}>
			{#if entry.children && entry.children.length > 0}
				<svelte:self entries={entry.children} />
			{/if}

			{#snippet icon()}
				{#if entry.isOpen}
					<ChevronDown class="size-4" />
					<Folder class="size-4" fill="grey" fill-opacity="0.3"/>
				{:else}
					<ChevronRight class="size-4" />
					<Folder class="size-4" fill="grey" fill-opacity="0.3"/>
				{/if}

			{/snippet}
		</TreeView.Folder>
	{:else}
		{@const iconPathPromise = getFileIcon(entry.name)}
		{#await iconPathPromise then iconFile}
			<TreeView.File
				name={entry.name}
				onclick={() => {
					editorStore.openTab(entry.path);
					console.log('Opened: ' + entry.path);
				}}
			>
				{#snippet icon()}
					<img src={iconFile} alt="" class="size-4 ml-4.5" />
				{/snippet}
			</TreeView.File>
		{/await}
	{/if}
{/each}