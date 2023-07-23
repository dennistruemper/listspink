import type { ItemPink } from './itemPink';

export type CurrentListPink = {
	activeItems: ItemPink[];
	completedItems: ItemPink[];
	name: string;
	id: string;
};
