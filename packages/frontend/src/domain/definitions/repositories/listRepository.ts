import type { UNKNOWN_DATA_SHAPE } from '../../../../../shared/src/definitions/errorCodes';
import type { ListPink } from '../../../../../shared/src/definitions/listPink';
import type { Result } from '../../../../../shared/src/languageExtension';

export type CreateListInput = {
	name: string;
	description?: string;
	token: string;
};

export type GetListsForUser = {
	token: string;
};

export interface ListRepository {
	create(data: CreateListInput): Promise<Result<ListPink, UNKNOWN_DATA_SHAPE>>;
	getAll(data: GetListsForUser): Promise<Result<ListPink[], UNKNOWN_DATA_SHAPE>>;
}
