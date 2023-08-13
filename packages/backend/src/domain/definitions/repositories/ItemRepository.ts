import { ItemPink } from '../../../../../shared/src/definitions/itemPink';
import { OptionalID } from '../../../../../shared/src/languageExtension';

export type CreateItemInput = OptionalID<ItemPink>;

export interface ItemRepository {
	create(item: CreateItemInput): Promise<ItemPink | undefined>;
	getItem(id: string): Promise<ItemPink | undefined>;
	getAllItems(): Promise<ItemPink[] | undefined>;
}
