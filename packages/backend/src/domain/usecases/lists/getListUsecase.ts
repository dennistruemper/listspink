import { ListPink } from '../../../../../shared/src/definitions/listPink';
import { Result, failure, success } from '../../../../../shared/src/languageExtension';
import { ListRepository } from '../../definitions/repositories/ListRepository';
import { UNKNOWN_DATA_SHAPE } from '../../errorCodes';
import { Usecase } from '../usecase';

export interface GetListInput {
	id: string;
}

export type GetListOutput = {
	list?: ListPink;
};

type Errors = UNKNOWN_DATA_SHAPE;

export class GetListUsecase implements Usecase<GetListInput, GetListOutput, Errors> {
	constructor(private readonly listRepository: ListRepository) {}

	async execute(data: GetListInput): Promise<Result<GetListOutput, Errors>> {
		const getResult = await this.listRepository.getList(data.id);
		if (getResult.success === false) {
			return failure(getResult.message, getResult.code);
		}
		return success({ list: getResult.value });
	}
}
