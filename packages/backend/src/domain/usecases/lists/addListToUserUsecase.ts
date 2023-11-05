import { Result, failure, success } from '../../../languageExtension';
import { UNKNOWN_DATA_SHAPE } from '../../definitions/errorCodes';
import { ListRepository } from '../../definitions/repositories/listRepository';

import { Usecase } from '../usecase';

export interface AddListToUserInput {
	userId: string;
	listId: string;
}

export type AddListToUserOutput = {
	userId: string;
	listId: string;
};

// TODO rethink what the flow should be
export class AddListToUserUsecase
	implements Usecase<AddListToUserInput, AddListToUserOutput, UNKNOWN_DATA_SHAPE>
{
	constructor(private readonly listRepository: ListRepository) {}

	async execute(
		data: AddListToUserInput
	): Promise<Result<AddListToUserOutput, UNKNOWN_DATA_SHAPE>> {
		const getResult = await this.listRepository.getList(data.userId);
		if (getResult.success === false) {
			return failure(getResult.message, getResult.code);
		}
		return success(data);
	}
}
