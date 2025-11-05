<script lang="ts">
    import * as TreeView from '$lib/components/ui/tree-view';
    import FileTreeNode from '$lib/components/feature/FileTree/FileTreeNode.svelte';
    import { onMount } from 'svelte';
    import { readDir } from '@tauri-apps/plugin-fs';

    const { path } = $props();

    interface FileTreeEntry {
        name: string;
        path: string;
        isDirectory: boolean;
        children?: FileTreeEntry[];
    }

		const ignoredFolders = new Set([
			'node_modules',
			'.git',
			'target',
			'dist',
			'build',
			'.svelte-kit',
			'.next',
			'out',
		]);

    async function generateFileTree(
        rootPath: string
    ): Promise<FileTreeEntry[]> {
        const entries: FileTreeEntry[] = [];
        try {
            const dirContents = await readDir(rootPath);

            for (const entry of dirContents) {
                const fullPath = `${rootPath}/${entry.name}`;

                if (entry.isDirectory) {
									let children : FileTreeEntry[];
									if(!ignoredFolders.has(entry.name)) {
										children = await generateFileTree(fullPath);
									}else{
                    children = [];
									}
                    entries.push({
                        name: entry.name,
                        path: fullPath,
                        isDirectory: true,
                        children: children,
                    });
                } else {
                    entries.push({
                        name: entry.name,
                        path: fullPath,
                        isDirectory: false,
                    });
                }
            }

            entries.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            });
        } catch (error) {
            console.error(`Error reading directory ${rootPath}:`, error);
        }
        return entries;
    }

    let fileTree: FileTreeEntry[] = $state([]);

    onMount(async () => {
        fileTree = await generateFileTree(path);
    });
</script>

<div class="">
    <TreeView.Root>
        {#if fileTree.length > 0}
            <FileTreeNode entries={fileTree} />
        {:else}
            <p>Loading file tree...</p>
        {/if}
    </TreeView.Root>
</div>