import { data, GetBatchResponse } from '@ampt/data';
import {
	UNKNOWN_DATA_SHAPE,
	UNKNOWN_DATA_SHAPE_CODE
} from '../../../domain/definitions/errorCodes';
import { IdGenerator } from '../../../domain/definitions/idGenerator';
import { ItemPink, itemSchema } from '../../../domain/definitions/itemPink';
import { listToItemConnectionSchema } from '../../../domain/definitions/listToItemConnection';
import {
	CreateItemErrors,
	CreateItemInput,
	GetAllItemsErrors,
	GetItemErrors,
	GetItemsForListInput,
	ItemRepository,
	UpdateItemInput
} from '../../../domain/definitions/repositories/itemRepository';
import { amptDelimiter, delimiter } from '../../../globalConstants';
import { failure, Result, success } from '../../../languageExtension';
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
					completed: item.value.completed,
					priority: item.value.priority
				};
			})
		);
	}

	async update(update: UpdateItemInput): Promise<Result<ItemPink, UNKNOWN_DATA_SHAPE>> {
		const key = this.storageId(update.itemId);
		const result = await data.set(key, update.updatedFields, {});

		if (result === undefined) {
			return failure('No Result from data source', UNKNOWN_DATA_SHAPE_CODE);
		}

		// load dependent items and update too
		const dependents = await data.get(`DEPENDS_ON_ITEM#${update.itemId}:*`, { label: 'label1' });
		dependents.items.forEach(async (item) => {
			const updateData = {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				itemName: update.updatedFields?.name ?? item.value.itemName,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				itemDescription: update.updatedFields?.description ?? item.value.itemDescription,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				priority: update.updatedFields?.priority ?? item.value.priority,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				completed: update.updatedFields?.completed ?? item.value.completed
			};
			await data.set(item.key, updateData);
		});
		const parsed = itemSchema.optional().safeParse(result);

		if (parsed.success === false) {
			return failure(parsed.error.message, UNKNOWN_DATA_SHAPE_CODE);
		} else if (parsed.data === undefined) {
			return failure('No Result from data source', UNKNOWN_DATA_SHAPE_CODE);
		}

		return success(parsed.data);
	}
}
