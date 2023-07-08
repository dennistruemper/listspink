import { forceExhaust } from '../util/languageExtension';
import type { AppState } from './definitions/appState';
import type { CurrentListPink } from './definitions/currentList';
import type { Dependencies } from './definitions/dependencies';
import type { Event } from './definitions/events';
import { createListPink } from './definitions/listPink';

function calculatCurrentList(state: AppState, currentListId: string): CurrentListPink | undefined {
	const listCandidates = state.lists.filter((list) => list.id === currentListId);
	if (listCandidates.length > 0) {
		const list = listCandidates[0];
		return {
			...list,
			items: list.itemsIds.map((itemId) => state.items.filter((item) => item.id === itemId)[0])
		};
	}
	// todo handle error for two?
	return undefined;
}

export function createUpdateFunction(deps: Dependencies) {
	return function updateAppState(previousState: AppState, event: Event): AppState {
		switch (event.type) {
			case 'add_item_to_list_event':
				return previousState;
			case 'create_item_and_add_to_list':
				return previousState;
			case 'create_list':
				const newList = createListPink(event.name, deps.uuidGenerator);
				return {
					...previousState,
					lists: [...previousState.lists, newList],
					currentList:
						previousState.lists.length === 0
							? calculatCurrentList(previousState, newList.id)
							: previousState.currentList
				};
			case 'remove_list':
				return {
					...previousState,
					lists: previousState.lists.filter((list) => list.id !== event.listId),
					currentList:
						previousState.currentList?.id !== event.listId ? previousState.currentList : undefined
				};
			case 'choose_list_by_id':
				return {
					...previousState,
					currentList: calculatCurrentList(previousState, event.listId)
				};
		}
		forceExhaust(event);
	};
}
