import {
	NO_ACCESS,
	NO_ACCESS_CODE,
	UNKNOWN_DATA_SHAPE
} from '../../../../../shared/src/definitions/errorCodes';
import { ItemPink } from '../../../../../shared/src/definitions/itemPink';
import { AtLeastOne, Result, failure, success } from '../../../../../shared/src/languageExtension';
import { ItemRepository } from '../../definitions/repositories/itemRepository';
import { ListRepository } from '../../definitions/repositories/listRepository';
import { Usecase } from '../usecase';

export interface UpdateItemInput {
	itemId: string;
	listId: string;
	userId: string;
	changes: AtLeastOne<Omit<ItemPink, 'id'>>;
}

export type UpdateItemOutput = {
	//
};

type Errors = UNKNOWN_DATA_SHAPE | NO_ACCESS;

export class UpdateItemUsecase implements Usecase<UpdateItemInput, UpdateItemOutput, Errors> {
	constructor(
		private readonly itemRepository: ItemRepository,
		private readonly listRepository: ListRepository
	) {}

	async execute(data: UpdateItemInput): Promise<Result<UpdateItemOutput, Errors>> {
		const hasAccessResult = await this.listRepository.userHasAccess({
			listId: data.listId,
			userId: data.userId
		});

		if (hasAccessResult.success === false)
			return failure(hasAccessResult.message, hasAccessResult.code);
		if (hasAccessResult.value === false)
			return failure('User does not have access to this list', NO_ACCESS_CODE);

		const updateResult = await this.itemRepository.update({
			itemId: data.itemId,
			updatedFields: data.changes
		});
		if (updateResult.success === false) return failure(updateResult.message, updateResult.code);

		return success({});
	}
}
