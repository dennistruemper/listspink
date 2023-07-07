import type { Item } from './item';

export type Event = AddItemToListEvent | CreateItemAndAddToList;

type AddItemToListEvent = {
	type: 'add_item_to_list_event';
	listId: string;
	itemId: string;
};

type CreateItemAndAddToList = {
	type: 'create_item_and_add_to_list';
	listId: string;
	item: Item;
};
