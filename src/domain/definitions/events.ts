import type { ItemPink } from './itemPink';

export type Event =
	| AddItemToListEvent
	| CreateItemAndAddToListEvent
	| CreateListEvent
	| ChooseListByIdEvent
	| RemoveListEvent;

interface EventBase {
	type: string;
}

interface AddItemToListEvent extends EventBase {
	type: 'add_item_to_list_event';
	listId: string;
	itemId: string;
}

interface CreateItemAndAddToListEvent extends EventBase {
	type: 'create_item_and_add_to_list';
	listId: string;
	item: ItemPink;
}

interface CreateListEvent extends EventBase {
	type: 'create_list';
	name: string;
}
interface ChooseListByIdEvent extends EventBase {
	type: 'choose_list_by_id';
	listId: string;
}

interface RemoveListEvent extends EventBase {
	type: 'remove_list';
	listId: string;
}
