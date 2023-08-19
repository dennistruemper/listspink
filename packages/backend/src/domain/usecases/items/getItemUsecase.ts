import { ItemPink } from '../../../../../shared/src/definitions/itemPink';
import { Result, failure, success } from '../../../../../shared/src/languageExtension';
import { ListRepository } from '../../definitions/repositories/ListRepository';
import { ItemRepository } from '../../definitions/repositories/itemRepository';
import { NO_ACCESS, NO_ACCESS_CODE, UNKNOWN_DATA_SHAPE } from '../../errorCodes';
import { Usecase } from '../usecase';

export interface GetItemInput {
	itemId: string;
	userId: string;
}

export type GetItemOutput = {
	item?: ItemPink;
};

type Errors = UNKNOWN_DATA_SHAPE | NO_ACCESS;

export class GetItemUsecase implements Usecase<GetItemInput, GetItemOutput, Errors> {
	constructor(
		private readonly itemRepository: ItemRepository,
		private readonly listRepository: ListRepository
	) {}

	async execute(data: GetItemInput): Promise<Result<GetItemOutput, Errors>> {
		const getResultPromise = this.itemRepository.getItem(data.itemId);
		const userHasListForItemResult = await this.listRepository.getListsByItemIdForUser({
			itemId: data.itemId,
			userId: data.userId
		});

		if (userHasListForItemResult.success === false)
			return failure(userHasListForItemResult.message, userHasListForItemResult.code);
		if (userHasListForItemResult.value.length === 0)
			return failure('User does not have access to this item', NO_ACCESS_CODE);

		const getResult = await getResultPromise;
		if (getResult.success === false) return failure(getResult.message, getResult.code);

		return success({ item: getResult.value });
	}
}
