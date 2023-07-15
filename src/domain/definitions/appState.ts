import type { CurrentListPink } from './currentList';
import type { Dependencies } from './dependencies';
import type { ItemPink } from './itemPink';
import type { ListPink } from './listPink';

export type AppState = {
	lists: ListPink[];
	items: ItemPink[];
	currentList?: CurrentListPink;
};

export function initialAppState(deps: Dependencies): AppState {
	const defaultItem = {
		name: 'Rename List',
		id: deps.uuidGenerator(),
		description: 'Go to Listsettings to rename Pink List'
	};
	const defaultList = {
		id: deps.uuidGenerator(),
		itemIds: [defaultItem.id],
		name: 'Pink List'
	};
	return {
		lists: [defaultList],
		items: [defaultItem],
		currentList: {
			id: defaultList.id,
			items: [defaultItem],
			name: defaultList.name
		}
	};
}
