<script lang="ts">
    import { FileText, GitBranch, Settings } from "@lucide/svelte"
    import {Button} from "$lib/components/ui/button";

    let { activeTab = 'files', onTabChange } = $props();

    function setActiveTab(tab: 'files' | 'git' | 'settings') {
        activeTab = tab;
        onTabChange?.(tab);
    }
</script>

<div class="flex flex-col items-center gap-1 bg-background border-r border-border p-1">
    <Button variant="ghost" size="icon" onclick={() => (activeTab = 'files')}>
        <FileText/>
    </Button>
    <Button variant="ghost" size="icon" onclick={() => (activeTab = 'git')}>
        <GitBranch/>
    </Button>

    <Button variant="ghost" size="icon" onclick={() => (activeTab = 'settings')}>
        <Settings/>
    </Button>
</div>