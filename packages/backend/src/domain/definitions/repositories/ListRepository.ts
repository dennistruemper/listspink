import { ListPink } from '../../../../../shared/src/definitions/listPink';
import { OptionalID } from '../../../../../shared/src/languageExtension';

export type CreateListInput = OptionalID<ListPink>;

export interface ListRepository {
	create(list: CreateListInput): Promise<ListPink | undefined>;
	getList(id: string): Promise<ListPink | undefined>;
	getAllLists(): Promise<ListPink[] | undefined>;
}
