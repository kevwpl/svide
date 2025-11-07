<script lang="ts">
    import FileTree from '$lib/components/feature/FileTree/FileTree.svelte';

    let { activeTab = 'files', projectPath = '' } = $props();
</script>

<div class="bg-background border-r border-border w-auto flex flex-col h-full overflow-hidden">
    {#if activeTab === 'files'}
        <div class="p-4 border-b border-border">
            <h2 class="text-sm font-medium text-white">{projectPath}</h2>
        </div>
        <div class="p-4 flex-1 overflow-auto">
            <FileTree path={projectPath} />
        </div>
    {:else if activeTab === 'git'}
        <div class="p-4">
            <h2 class="text-sm font-semibold text-white">Git</h2>
            <p class="text-xs text-gray-400 mt-2">Git integration coming soon...</p>
        </div>
    {:else if activeTab === 'settings'}
        <div class="p-4">
            <h2 class="text-sm font-semibold text-white">Settings</h2>
            <p class="text-xs text-gray-400 mt-2">Settings coming soon...</p>
        </div>
    {/if}
</div>