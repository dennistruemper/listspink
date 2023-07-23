// detail implementation

import { LocalStorage } from '../adapter/localStorage';
import { prodDependencies } from '../dependencies';
import { initialAppState, type AppState } from '../domain/definitions/appState';
import { createUpdateFunction } from '../domain/updateAppState';
import type { TimeTravelStore } from './timetravelStore';
import { createTimetraveStore } from './timetravelStore';

// creation of detail instance
export const appStore = createTimetraveStore(
	createUpdateFunction(prodDependencies),
	() => initialAppState(prodDependencies),
	new LocalStorage<TimeTravelStore<AppState>>()
);
