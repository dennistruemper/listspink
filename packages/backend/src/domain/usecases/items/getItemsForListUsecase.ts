import { ItemPink } from '../../../../../shared/src/definitions/itemPink';
import { Result, failure, success } from '../../../../../shared/src/languageExtension';
import { ListRepository } from '../../definitions/repositories/ListRepository';
import { ItemRepository } from '../../definitions/repositories/itemRepository';
import {
	NO_ACCESS,
	NO_ACCESS_CODE,
	UNKNOWN_DATA_SHAPE
} from '../../../../../shared/src/definitions/errorCodes';
import { Usecase } from '../usecase';

export interface GetItemsForListInput {
	listId: string;
	userId: string;
}

export type GetItemsForListOutput = {
	items: ItemPink[];
};

type Errors = UNKNOWN_DATA_SHAPE | NO_ACCESS;

export class GetItemsForListUsecase
	implements Usecase<GetItemsForListInput, GetItemsForListOutput, Errors>
{
	constructor(
		private readonly itemRepository: ItemRepository,
		private readonly listRepository: ListRepository
	) {}

	async execute(data: GetItemsForListInput): Promise<Result<GetItemsForListOutput, Errors>> {
		const getResultPromise = this.itemRepository.getItemsForList({ listId: data.listId });
		const hasAccessResult = await this.listRepository.userHasAccess({
			listId: data.listId,
			userId: data.userId
		});

		if (hasAccessResult.success === false)
			return failure(hasAccessResult.message, hasAccessResult.code);
		if (hasAccessResult.value === false)
			return failure('User does not have access to this list', NO_ACCESS_CODE);

		const getResult = await getResultPromise;
		if (getResult.success === false) return failure(getResult.message, getResult.code);

		return success({ items: getResult.value });
	}
}
