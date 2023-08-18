import { ListPink } from '../../../../../shared/src/definitions/listPink';
import { OptionalID, Result } from '../../../../../shared/src/languageExtension';

export type CreateListInput = OptionalID<ListPink>;

export interface ListRepository {
	create(list: CreateListInput): Promise<Result<ListPink>>;
	getList(id: string): Promise<Result<ListPink | undefined>>;
	getAllLists(): Promise<Result<ListPink[]>>;
}
