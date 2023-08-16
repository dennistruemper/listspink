import type { ItemPink } from '../../../../shared/src/definitions/itemPink';
import type { ListPink } from '../../../../shared/src/definitions/listPink';
import type { CurrentListPink } from './currentList';
import type { Dependencies } from './dependencies';
import type { User } from './user';

export type AppState = {
	user?: User;
	accessToken?: string;
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
			completedItems: [],
			activeItems: [defaultItem],
			name: defaultList.name
		}
	};
}
