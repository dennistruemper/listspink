// detail implementation

import { LocalStorage } from '../adapter/localStorage';
import { getDependencies } from '../dependencies';
import { initialAppState, type AppState } from '../domain/definitions/appState';
import { createUpdateFunction } from '../domain/updateAppState';
import type { TimeTravelStore } from './timetravelStore';
import { createTimetraveStore } from './timetravelStore';

async function init() {
	// creation of detail instance
	const store = await createTimetraveStore(
		createUpdateFunction(getDependencies()),
		() => Promise.resolve(initialAppState(getDependencies())),
		new LocalStorage<TimeTravelStore<AppState>>()
	);
	store.dispatch({ type: 'refresh_data' });
	return store;
}

export const appStore = await init();
