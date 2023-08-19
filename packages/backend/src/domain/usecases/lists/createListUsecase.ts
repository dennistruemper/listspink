import { ListPink } from '../../../../../shared/src/definitions/listPink';
import { Result, failure, success } from '../../../../../shared/src/languageExtension';
import {
	ConnectToUserErrors,
	CreateListErrors,
	ListRepository
} from '../../definitions/repositories/ListRepository';
import { Usecase } from '../usecase';

export interface CreateListInput {
	userId: string;
	name: string;
	description?: string;
}

export type CreateListOutput = {
	list: ListPink;
};

type Errors = CreateListErrors | ConnectToUserErrors;

export class CreateListUsecase implements Usecase<CreateListInput, CreateListOutput, Errors> {
	constructor(private readonly listRepository: ListRepository) {}

	async execute(data: CreateListInput): Promise<Result<CreateListOutput, Errors>> {
		const created = await this.listRepository.create({ ...data, itemIds: [] });
		if (created.success === false) {
			return failure('List not created', created.code);
		}

		const connected = await this.listRepository.connectToUser({
			listId: created.value.id,
			userId: data.userId
		});

		if (connected.success === false) {
			return failure('List not connected to user', connected.code);
		}

		return success({ list: created.value });
	}
}
