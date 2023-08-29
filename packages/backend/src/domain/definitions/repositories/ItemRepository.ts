import { UNKNOWN_DATA_SHAPE } from '../../../../../shared/src/definitions/errorCodes';
import { ItemPink } from '../../../../../shared/src/definitions/itemPink';
import { OptionalID, Result, UpdateInput } from '../../../../../shared/src/languageExtension';

export type CreateItemInput = OptionalID<ItemPink>;
export type GetItemsForListInput = { listId: string };
export type UpdateItemInput = {
	itemId: string;
	updatedFields: UpdateInput<Omit<ItemPink, 'id'>>;
};

export type CreateItemErrors = UNKNOWN_DATA_SHAPE;
export type GetItemErrors = UNKNOWN_DATA_SHAPE;
export type GetAllItemsErrors = UNKNOWN_DATA_SHAPE;
export type GetItemsForListErrors = UNKNOWN_DATA_SHAPE;

export interface ItemRepository {
	create(item: CreateItemInput): Promise<Result<ItemPink, CreateItemErrors>>;
	getItem(id: string): Promise<Result<ItemPink | undefined, GetItemErrors>>;
	getAllItems(): Promise<Result<ItemPink[], GetAllItemsErrors>>;
	getItemsForList(input: GetItemsForListInput): Promise<Result<ItemPink[], GetItemsForListErrors>>;
	update(update: UpdateItemInput): Promise<Result<void, UNKNOWN_DATA_SHAPE>>;
}
