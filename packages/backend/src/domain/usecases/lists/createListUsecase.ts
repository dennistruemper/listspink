import { ListPink } from '../../../../../shared/src/definitions/listPink';
import { Result, failure, success } from '../../../../../shared/src/languageExtension';
import { ListRepository } from '../../definitions/repositories/ListRepository';
import { Usecase } from '../usecase';

export interface CreateListInput {
	name: string;
	description?: string;
}

export type CreateListOutput = {
	list: ListPink;
};

export class CreateListUsecase implements Usecase<CreateListInput, CreateListOutput> {
	constructor(private readonly listRepository: ListRepository) {}

	async execute(data: CreateListInput): Promise<Result<CreateListOutput>> {
		const created = await this.listRepository.create({ ...data, itemIds: [] });
		if (created.success === false) {
			return failure('List not created', created.code);
		}
		return success({ list: created.value });
	}
}
