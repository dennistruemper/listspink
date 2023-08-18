import { ListPink } from '../../../../../shared/src/definitions/listPink';
import { Result, failure, success } from '../../../../../shared/src/languageExtension';
import { ListRepository } from '../../definitions/repositories/ListRepository';
import { Usecase } from '../usecase';

export interface GetListInput {
	id: string;
}

export type GetListOutput = {
	list?: ListPink;
};

export class GetListUsecase implements Usecase<GetListInput, GetListOutput> {
	constructor(private readonly listRepository: ListRepository) {}

	async execute(data: GetListInput): Promise<Result<GetListOutput>> {
		const getResult = await this.listRepository.getList(data.id);
		if (getResult.success === false) {
			return failure(getResult.message, getResult.code);
		}
		return success({ list: getResult.value });
	}
}
