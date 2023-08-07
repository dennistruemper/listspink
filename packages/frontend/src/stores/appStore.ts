// detail implementation

import { LocalStorage } from '../adapter/localStorage';
import { prodDependencies } from '../dependencies';
import { initialAppState, type AppState } from '../domain/definitions/appState';
import { createUpdateFunction } from '../domain/updateAppState';
import type { TimeTravelStore } from './timetravelStore';
import { createTimetraveStore } from './timetravelStore';

function init() {
	// creation of detail instance
	const store = createTimetraveStore(
		createUpdateFunction(prodDependencies),
		() => initialAppState(prodDependencies),
		new LocalStorage<TimeTravelStore<AppState>>()
	);
	store.dispatch({ type: 'refresh_data' });
	return store;
}

export const appStore = init();
