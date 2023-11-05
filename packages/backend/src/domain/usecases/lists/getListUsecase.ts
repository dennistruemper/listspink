import { Result, failure, success } from '../../../languageExtension';
import { NO_ACCESS, NO_ACCESS_CODE, UNKNOWN_DATA_SHAPE } from '../../definitions/errorCodes';
import { ListPink } from '../../definitions/listPink';
import { ListRepository } from '../../definitions/repositories/listRepository';
import { Usecase } from '../usecase';

export interface GetListInput {
	listId: string;
	userId: string;
}

export type GetListOutput = {
	list?: ListPink;
};

type Errors = UNKNOWN_DATA_SHAPE | NO_ACCESS;

export class GetListUsecase implements Usecase<GetListInput, GetListOutput, Errors> {
	constructor(private readonly listRepository: ListRepository) {}

	async execute(data: GetListInput): Promise<Result<GetListOutput, Errors>> {
		const getResultPromise = this.listRepository.getList(data.listId);
		const userHasList = await this.listRepository.userHasAccess({
			listId: data.listId,
			userId: data.userId
		});
		const getResult = await getResultPromise;

		if (userHasList.success === false) return failure(userHasList.message, userHasList.code);

		if (getResult.success === false) return failure(getResult.message, getResult.code);

		if (userHasList.value === false)
			return failure('User does not have access to this list', NO_ACCESS_CODE);

		return success({ list: getResult.value });
	}
}
