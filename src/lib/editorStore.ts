import { writable } from 'svelte/store';

export interface OpenTab {
	id: string;
	path: string;
	name: string;
	isDirty: boolean;
}

function createEditorStore() {
	const { subscribe, set, update } = writable<{
		tabs: OpenTab[];
		activeTabId: string | null;
	}>({
		tabs: [],
		activeTabId: null,
	});

	return {
		subscribe,
		openTab: (path: string) =>
			update((state) => {
				const existingTab = state.tabs.find((t) => t.path === path);
				if (existingTab) {
					return { ...state, activeTabId: existingTab.id };
				}

				const name = path.split('/').pop() || path.split('\\').pop() || path;
				const id = path;
				const newTab = { id, path, name, isDirty: false };

				return {
					tabs: [...state.tabs, newTab],
					activeTabId: id,
				};
			}),
		addTab: (tab: Omit<OpenTab, 'isDirty'>) =>
			update((state) => {
				if (state.tabs.some((t) => t.id === tab.id)) {
					return { ...state, activeTabId: tab.id };
				}
				const newTab = { ...tab, isDirty: false };
				return {
					tabs: [...state.tabs, newTab],
					activeTabId: tab.id,
				};
			}),
		closeTab: (id: string) =>
			update((state) => {
				const tabs = state.tabs.filter((t) => t.id !== id);
				const activeTabId =
					state.activeTabId === id
						? tabs.length > 0
							? tabs[tabs.length - 1].id
							: null
						: state.activeTabId;
				return { tabs, activeTabId };
			}),
		setActiveTab: (id: string) =>
			update((state) => ({ ...state, activeTabId: id })),
		setTabDirty: (id: string, isDirty: boolean) =>
			update((state) => ({
				...state,
				tabs: state.tabs.map((t) => (t.id === id ? { ...t, isDirty } : t)),
			})),
		clear: () => set({ tabs: [], activeTabId: null }),
	};
}

export const editorStore = createEditorStore();