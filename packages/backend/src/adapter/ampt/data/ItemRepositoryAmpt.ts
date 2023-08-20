import { data, GetBatchResponse } from '@ampt/data';
import { IdGenerator } from '../../../../../shared/src/definitions/idGenerator';
import { ItemPink, itemSchema } from '../../../../../shared/src/definitions/itemPink';
import { listToItemConnectionSchema } from '../../../../../shared/src/definitions/listToItemConnection';
import { amptDelimiter, delimiter } from '../../../../../shared/src/globalConstants';
import { failure, Result, success } from '../../../../../shared/src/languageExtension';
import {
	CreateItemErrors,
	CreateItemInput,
	GetAllItemsErrors,
	GetItemErrors,
	GetItemsForListInput,
	ItemRepository
} from '../../../domain/definitions/repositories/itemRepository';
import { UNKNOWN_DATA_SHAPE_CODE } from '../../../domain/errorCodes';
import { batchResultSchema } from './batchResultSchema';

const getItemsSchema = batchResultSchema(itemSchema);
const getListToItemConnectionSchema = batchResultSchema(listToItemConnectionSchema);

export class ItemRepositoryAmpt implements ItemRepository {
	private storageName = 'ITEM';
	private idGenerator;

	constructor(idGenerator: IdGenerator) {
		this.idGenerator = idGenerator;
	}

	private storageId(id: string): string {
		const idPart = `${this.storageName}${delimiter}${id}`;
		return `${idPart}${amptDelimiter}${idPart}`;
	}

	async getItem(id: string): Promise<Result<ItemPink | undefined, GetItemErrors>> {
		const result = await data.get(this.storageId(id));
		const parsed = itemSchema.optional().safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure(parsed.error.message, UNKNOWN_DATA_SHAPE_CODE);
	}
	public async create(item: CreateItemInput): Promise<Result<ItemPink, CreateItemErrors>> {
		const id = item.id ?? this.idGenerator.generate();
		const storageId = this.storageId(id);

		const result = await data.set(
			storageId,
			{ ...item, id },
			{ label5: `${this.storageName}S${amptDelimiter}${storageId}` }
		);

		const parsed = itemSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure(parsed.error.message, UNKNOWN_DATA_SHAPE_CODE);
	}

	async getAllItems(): Promise<Result<ItemPink[], GetAllItemsErrors>> {
		let loaded: GetBatchResponse<unknown> | undefined = await data.getByLabel(
			'label5',
			`${this.storageName}S${amptDelimiter}*`
		);
		const result: ItemPink[] = [];

		while (loaded) {
			const parsed = getItemsSchema.safeParse(loaded);
			if (parsed.success) {
				result.push(...parsed.data.items.map((item) => item.value));
			} else {
				return failure(
					'parsing failed with errors:' + JSON.stringify(parsed.error),
					UNKNOWN_DATA_SHAPE_CODE
				);
			}

			loaded = loaded.next ? ((await loaded.next()) as GetBatchResponse<unknown>) : undefined;
		}

		return success(result);
	}

	async getItemsForList(
		input: GetItemsForListInput
	): Promise<Result<ItemPink[], GetAllItemsErrors>> {
		const key = `LIST${delimiter}${input.listId}${amptDelimiter}ITEM${delimiter}*`;

		const loaded = await data.get(key);

		const parsed = getListToItemConnectionSchema.safeParse(loaded);
		if (parsed.success === false) {
			return failure(
				'parsing failed with errors:' + JSON.stringify(parsed.error),
				UNKNOWN_DATA_SHAPE_CODE
			);
		}

		return success(
			parsed.data.items.map((item) => {
				return {
					id: item.value.itemId,
					name: item.value.itemName,
					description: item.value.itemDescription,
					completed: item.value.itemCompleted
				};
			})
		);
	}
}
