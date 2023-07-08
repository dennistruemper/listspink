import { writable } from 'svelte/store';

interface TitleStoreState {
	title: string;
	listChooseMode: boolean;
}

export const titleStore = writable<TitleStoreState>({ title: 'Home', listChooseMode: true });
