// detail implementation

import { LocalStorage } from '../adapter/localStorage';
import { getDependencies } from '../dependencies';
import { initialAppState, type AppState } from '../domain/definitions/appState';
import { createUpdateFunction } from '../domain/updateAppState';
import type { TimeTravelStore } from './timetravelStore';
import { createTimetraveStore } from './timetravelStore';

async function init() {
	const dependencies = await getDependencies();
	// creation of detail instance
	const store = await createTimetraveStore(
		createUpdateFunction(dependencies),
		() => Promise.resolve(initialAppState(dependencies)),
		new LocalStorage<TimeTravelStore<AppState>>()
	);
	store.dispatch({ type: 'refresh_data' });
	return store;
}

export const appStore = await init();
