<script lang="ts">
	import Editor from '$lib/components/feature/Editor/Editor.svelte';
	import { editorStore } from '$lib/editorStore';

	let editorState = $derived.by(() => {
		let result: any;
		editorStore.subscribe((s) => {
			result = s;
		})();
		return result;
	});
</script>

<div class="flex flex-col h-full bg-gray-950 overflow-hidden">
	<Editor activeTabId={editorState.activeTabId} />
</div>