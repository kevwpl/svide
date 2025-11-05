<script lang="ts">
    import * as TreeView from '$lib/components/ui/tree-view';
		import { editorStore } from '$lib/editorStore';

    export let entries: Array<{
        name: string;
        path: string;
        isDirectory: boolean;
        children?: any[];
    }>;
</script>

{#each entries as entry}
    {#if entry.isDirectory}
        <TreeView.Folder name={entry.name} open={false}>
            {#if entry.children && entry.children.length > 0}
                <svelte:self entries={entry.children} />
            {/if}
        </TreeView.Folder>
    {:else}
        <TreeView.File name={entry.name} onclick={() => {
					editorStore.openTab(entry.path);
					console.log("Opened: " + entry.path);
        }}/>
    {/if}
{/each}