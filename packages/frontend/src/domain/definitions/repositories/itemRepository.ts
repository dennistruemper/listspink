import type { UNKNOWN_DATA_SHAPE } from '../../../../../shared/src/definitions/errorCodes';
import type { ItemPink } from '../../../../../shared/src/definitions/itemPink';
import type { Result, UpdateInput } from '../../../../../shared/src/languageExtension';

export type CreateItemInput = {
	name: string;
	description?: string;
	listId: string;
	token: string;
};

export type UpdateItemInput = {
	itemId: string;
	listId: string;
	token: string;
	changes: UpdateInput<Omit<ItemPink, 'id'>>;
};

export type GetItemsForListInput = {
	token: string;
	listId: string;
};

export type GetItemsForListResponse = {
	items: ({
		listId: string;
	} & ItemPink)[];
};

export interface ItemRepository {
	create(data: CreateItemInput): Promise<Result<ItemPink, UNKNOWN_DATA_SHAPE>>;
	update(data: UpdateItemInput): Promise<Result<void, UNKNOWN_DATA_SHAPE>>;
	getAll(data: GetItemsForListInput): Promise<Result<GetItemsForListResponse, UNKNOWN_DATA_SHAPE>>;
}
