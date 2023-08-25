import { createItemPink, type ItemPink } from '../../../shared/src/definitions/itemPink';
import { createListPink } from '../../../shared/src/definitions/listPink';
import { forceExhaust } from '../../../shared/src/languageExtension';
import type { AppState } from './definitions/appState';
import type { CurrentListPink } from './definitions/currentList';
import type { Dependencies } from './definitions/dependencies';
import type { Event } from './definitions/events';

function calculateCurrentList(
	state: AppState,
	currentListId?: string
): CurrentListPink | undefined {
	if (currentListId === undefined) {
		return undefined;
	}

	const listCandidates = state.lists.filter((list) => list.id === currentListId);
	if (listCandidates.length > 0) {
		const list = listCandidates[0];
		const items = list.itemIds.map((itemId) => state.items.filter((item) => item.id === itemId)[0]);

		const activeItems = items.filter((item) => item.completed === undefined);

		const completedItems = items.filter((item) => item.completed !== undefined);
		completedItems.sort((a, b) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return -(new Date(a.completed!).getTime() - new Date(b.completed!).getTime());
		});

		return {
			...list,
			activeItems: activeItems,
			completedItems: completedItems
		};
	}
	// todo handle error for two?
	return undefined;
}

export function createUpdateFunction(deps: Dependencies) {
	return async function updateAppState(previousState: AppState, event: Event): Promise<AppState> {
		switch (event.type) {
			case 'login_initialized': {
				await deps.authRepository.login();
				return previousState;
			}
			case 'logout': {
				await deps.authRepository.logout();
				return {
					...previousState,
					user: undefined,
					accessToken: undefined
				};
			}
			case 'login_check': {
				await deps.authRepository.handleRedirectCallback(event.url);
				const user = await deps.authRepository.getUser();
				return {
					...previousState,
					user: user,
					accessToken: await deps.authRepository.getAccessToken()
				};
			}
			case 'refresh_data': {
				return {
					...previousState,
					currentList: calculateCurrentList(previousState, previousState.currentList?.id)
				};
			}
			case 'add_item_to_list_event': {
				const intermediateState2: AppState = {
					...previousState,
					lists: previousState.lists.map((list) => {
						if (event.listId !== list.id) {
							return list;
						}

						return { ...list, itemIds: [...list.itemIds, event.itemId] };
					})
				};

				// only recalculate current list, if it it the list that was added to
				if (previousState.currentList?.id !== event.listId) {
					return intermediateState2;
				}

				return {
					...intermediateState2,
					currentList: calculateCurrentList(intermediateState2, intermediateState2.currentList?.id)
				};
			}
			case 'create_item_and_add_to_lists': {
				const newItem = createItemPink({
					name: event.name,
					uuidGenerator: deps.uuidGenerator,
					description: event.description
				});
				const intermediateState: AppState = {
					...previousState,
					items: [...previousState.items, newItem],
					lists: previousState.lists.map((list) => {
						if (event.listIds.indexOf(list.id) === -1) {
							return list;
						}

						return { ...list, itemIds: [...list.itemIds, newItem.id] };
					})
				};
				return {
					...intermediateState,
					currentList: calculateCurrentList(intermediateState, intermediateState.currentList?.id)
				};
			}
			case 'create_list': {
				const token = await deps.authRepository.getAccessToken();
				let newList;
				if (token !== undefined) {
					const createResult = await deps.listRepository.create({
						name: event.name,
						description: undefined,
						token: token
					});
					if (createResult.success === false)
						throw new Error('List creation failed: ' + createResult.message);
					newList = createResult.value;
				} else {
					newList = createListPink(event.name, deps.uuidGenerator);
				}
				return {
					...previousState,
					lists: [...previousState.lists, newList],
					currentList:
						previousState.lists.length === 0
							? calculateCurrentList(previousState, newList.id)
							: previousState.currentList
				};
			}
			case 'remove_list': {
				return {
					...previousState,
					lists: previousState.lists.filter((list) => list.id !== event.listId),
					currentList:
						previousState.currentList?.id !== event.listId ? previousState.currentList : undefined
				};
			}
			case 'choose_list_by_id': {
				return {
					...previousState,
					currentList: calculateCurrentList(previousState, event.listId)
				};
			}
			case 'toggle_item_done_event': {
				const intermediateState3 = {
					...previousState,
					items: previousState.items.map((item) =>
						toggleMatchingItemCompleted(item, event.itemId, event.time)
					)
				};
				return {
					...intermediateState3,
					currentList: calculateCurrentList(intermediateState3, previousState.currentList?.id)
				};
			}
			case 'edit_list': {
				const intermediateState4 = {
					...previousState,
					lists: previousState.lists.map((list) => {
						if (list.id !== event.listId) {
							return list;
						}

						return { ...list, name: event.name ?? list.name };
					})
				};
				return {
					...intermediateState4,
					currentList: calculateCurrentList(intermediateState4, previousState.currentList?.id)
				};
			}
			case 'edit_item': {
				const intermediateState5 = {
					...previousState,
					items: previousState.items.map((item) => {
						if (item.id !== event.itemId) {
							return item;
						}

						return {
							...item,
							name: event.name ?? item.name,
							description: event.description ?? item.description
						};
					})
				};
				return {
					...intermediateState5,
					currentList: calculateCurrentList(intermediateState5, previousState.currentList?.id)
				};
			}
			case 'load_lists': {
				const token = await deps.authRepository.getAccessToken();
				if (token === undefined) throw new Error('No token found');
				const listsResult = await deps.listRepository.getAll({ token: token });
				if (listsResult.success === false)
					throw new Error('Failed to load lists: ' + listsResult.message);

				const loadedListsState = { ...previousState, lists: listsResult.value };

				return {
					...loadedListsState,
					currentList: calculateCurrentList(loadedListsState, listsResult.value[0]?.id)
				};
			}
			case 'load_version': {
				const versionResult = await deps.versionRepository.getVersion();
				if (versionResult.success === false) throw new Error('Failed to load version');
				return {
					...previousState,
					version: versionResult.data.version
				};
			}
		}
		forceExhaust(event);
	};
}

function toggleMatchingItemCompleted(item: ItemPink, itemId: string, time: Date): ItemPink {
	if (item.id !== itemId) {
		return item;
	}

	if (item.completed === undefined) {
		return {
			...item,
			completed: time.toISOString()
		};
	} else {
		return {
			...item,
			completed: undefined
		};
	}
}
