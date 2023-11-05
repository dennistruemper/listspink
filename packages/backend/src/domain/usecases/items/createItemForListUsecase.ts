import { Result, failure, success } from '../../../languageExtension';
import {
	NO_ACCESS,
	NO_ACCESS_CODE,
	UNKNOWN_DATA_SHAPE
} from '../../definitions/errorCodes';
import { ItemPink } from '../../definitions/itemPink';
import { ItemRepository } from '../../definitions/repositories/itemRepository';
import { ListRepository } from '../../definitions/repositories/listRepository';
import { Usecase } from '../usecase';

export interface CreateItemInput {
	userId: string;
	itemName: string;
	itemDescription?: string;
	listId: string;
	extraListIds?: string[];
}

export type CreateItemOutput = {
	item: ItemPink;
};

type Errors = UNKNOWN_DATA_SHAPE | NO_ACCESS;

export class CreateItemForListUsecase
	implements Usecase<CreateItemInput, CreateItemOutput, Errors>
{
	constructor(
		private readonly itemRepository: ItemRepository,
		private readonly listRepository: ListRepository
	) {}

	async execute(data: CreateItemInput): Promise<Result<CreateItemOutput, Errors>> {
		const created = await this.itemRepository.create({
			name: data.itemName,
			description: data.itemDescription
		});
		if (created.success === false) {
			return failure('Item not created', created.code);
		}

		const hasAccessResult = await this.listRepository.userHasAccess({
			listId: data.listId,
			userId: data.userId
		});

		if (hasAccessResult.success === false)
			return failure('Could not check if user has access', hasAccessResult.code);
		if (hasAccessResult.value === false)
			return failure('User does not have access to list', NO_ACCESS_CODE);

		const connectResult = await this.listRepository.connectItemToList({
			listId: data.listId,
			itemId: created.value.id,
			itemName: data.itemName,
			itemDescription: data.itemDescription
		});

		if (connectResult.success === false)
			return failure('Could not connect item to list', connectResult.code);

		return success({ item: created.value });
	}
}
