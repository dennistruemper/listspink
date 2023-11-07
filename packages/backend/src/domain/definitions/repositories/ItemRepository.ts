import { OptionalID, Result, UpdateInput } from '../../../languageExtension';
import { UNKNOWN_DATA_SHAPE } from '../errorCodes';
import { ItemPink } from '../itemPink';

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
	update(update: UpdateItemInput): Promise<Result<ItemPink, UNKNOWN_DATA_SHAPE>>;
}
