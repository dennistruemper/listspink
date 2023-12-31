import { Result, UpdateInput, failure, success } from '../../../languageExtension';
import {
	NO_ACCESS,
	NO_ACCESS_CODE,
	UNKNOWN_DATA_SHAPE,
	UNKNOWN_DATA_SHAPE_CODE
} from '../../definitions/errorCodes';
import { ItemPink } from '../../definitions/itemPink';
import { ItemRepository } from '../../definitions/repositories/itemRepository';
import { ListRepository } from '../../definitions/repositories/listRepository';
import { Usecase } from '../usecase';

export interface UpdateItemInput {
	itemId: string;
	listId: string;
	userId: string;
	changes: UpdateInput<Omit<ItemPink, 'id'>>;
}

export type UpdateItemOutput = ItemPink;

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

		if (data.changes?.name === '') {
			console.log('data.changes', data.changes);
			return failure('Name cannot be empty', UNKNOWN_DATA_SHAPE_CODE);
		}

		const updateResult = await this.itemRepository.update({
			itemId: data.itemId,
			updatedFields: data.changes
		});
		if (updateResult.success === false) {
			return failure(updateResult.message, updateResult.code);
		}

		return success(updateResult.value);
	}
}
