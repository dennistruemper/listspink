export type Event =
	| AddItemToListEvent
	| AuthLoginCheckEvent
	| AuthLoginInitializedEvent
	| AuthLogoutEvent
	| ChooseListByIdEvent
	| CreateItemAndAddToListsEvent
	| CreateListEvent
	| EditItemEvent
	| EditListEvent
	| LoadItemsEvent
	| LoadListsEvent
	| LoadVersionEvent
	| RefreshDataEvent
	| RemoveListEvent
	| ToggleItemDoneEvent;

interface EventBase {
	type: string;
}

interface AuthLoginCheckEvent extends EventBase {
	type: 'login_check';
	url: string;
}
interface AuthLoginInitializedEvent extends EventBase {
	type: 'login_initialized';
}

interface AuthLogoutEvent extends EventBase {
	type: 'logout';
}

interface RefreshDataEvent extends EventBase {
	type: 'refresh_data';
}

interface AddItemToListEvent extends EventBase {
	type: 'add_item_to_list_event';
	listId: string;
	itemId: string;
}

interface EditItemEvent extends EventBase {
	type: 'edit_item';
	itemId: string;
	name?: string;
	description?: string;
}

interface ToggleItemDoneEvent extends EventBase {
	type: 'toggle_item_done_event';
	itemId: string;
	time: Date;
}
interface CreateItemAndAddToListsEvent extends EventBase {
	type: 'create_item_and_add_to_lists';
	listIds: string[];
	name: string;
	description?: string;
}

interface CreateListEvent extends EventBase {
	type: 'create_list';
	name: string;
}
interface ChooseListByIdEvent extends EventBase {
	type: 'choose_list_by_id';
	listId: string;
}

interface EditListEvent extends EventBase {
	type: 'edit_list';
	listId: string;
	name?: string;
}
interface RemoveListEvent extends EventBase {
	type: 'remove_list';
	listId: string;
}

interface LoadListsEvent extends EventBase {
	type: 'load_lists';
}

interface LoadVersionEvent extends EventBase {
	type: 'load_version';
}

interface LoadItemsEvent extends EventBase {
	type: 'load_items_for_list';
	listId: string;
}
