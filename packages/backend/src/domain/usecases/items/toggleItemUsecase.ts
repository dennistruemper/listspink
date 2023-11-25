import { Result, failure, success } from '../../../languageExtension';
import { NO_ACCESS, NO_ACCESS_CODE, UNKNOWN_DATA_SHAPE } from '../../definitions/errorCodes';
import { ItemRepository } from '../../definitions/repositories/itemRepository';
import { ListRepository } from '../../definitions/repositories/listRepository';
import { Usecase } from '../usecase';

export interface ToggleItemInput {
	itemId: string;
	listId: string;
	userId: string;
	now: Date;
}

export type ToggleItemOutput = {
	//
};

type Errors = UNKNOWN_DATA_SHAPE | NO_ACCESS;

export class ToggleItemUsecase implements Usecase<ToggleItemInput, ToggleItemOutput, Errors> {
	constructor(
		private readonly itemRepository: ItemRepository,
		private readonly listRepository: ListRepository
	) {}

	async execute(data: ToggleItemInput): Promise<Result<ToggleItemOutput, Errors>> {
		const hasAccessResult = await this.listRepository.userHasAccess({
			listId: data.listId,
			userId: data.userId
		});

		if (hasAccessResult.success === false)
			return failure(hasAccessResult.message, hasAccessResult.code);
		if (hasAccessResult.value === false)
			return failure('User does not have access to this list', NO_ACCESS_CODE);

		const beforeState = await this.itemRepository.getItem(data.itemId);

		if (beforeState.success === false) {
			return failure(beforeState.message, beforeState.code);
		}

		const newCompletedState = beforeState.value?.completed ? null : data.now.toISOString();

		const updateData = {
			itemId: data.itemId,
			updatedFields: { completed: newCompletedState }
		};
		console.log('updateData', updateData);
		const updateResult = await this.itemRepository.update(updateData);
		if (updateResult.success === false) return failure(updateResult.message, updateResult.code);

		return success({});
	}
}
