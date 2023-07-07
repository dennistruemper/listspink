import { forceExhaust } from '../util/languageExtension';
import type { AppState } from './definitions/appState';
import type { Event } from './definitions/events';

export function updateAppState(state: AppState, event: Event): AppState {
	switch (event.type) {
		case 'add_item_to_list_event':
			return state;
		case 'create_item_and_add_to_list':
			return state;
	}
	forceExhaust(event);
}
