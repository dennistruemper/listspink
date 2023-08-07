import { browser } from '$app/environment';
import type { TimeTravelStorage } from '../stores/timetravelStore';

const STORAGE_KEY = 'appState';
export class LocalStorage<T> implements TimeTravelStorage<T> {
	// TODO implement
	save(data: T) {
		if (browser) {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		}
	}
	load(): T | undefined {
		if (!browser) {
			return undefined;
		}
		const loaded = window.localStorage.getItem(STORAGE_KEY);
		if (loaded === null) {
			return undefined;
		}

		return JSON.parse(loaded) as T;
	}
}
