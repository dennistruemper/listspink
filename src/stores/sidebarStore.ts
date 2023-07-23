import { writable } from 'svelte/store';

//export const sidebarStore = writable({ visible: false });

function createStore() {
	const { subscribe, update } = writable({ visible: false });

	return {
		subscribe,
		toggle: () =>
			update((n) => {
				return { ...n, visible: !n.visible };
			})
	};
}

export const sidebarStore = createStore();
