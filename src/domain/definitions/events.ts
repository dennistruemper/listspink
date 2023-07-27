export type Event =
	| RefreshDataEvent
	| AddItemToListEvent
	| EditItemEvent
	| CreateItemAndAddToListsEvent
	| ToggleItemDoneEvent
	| CreateListEvent
	| ChooseListByIdEvent
	| EditListEvent
	| RemoveListEvent;

interface EventBase {
	type: string;
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
