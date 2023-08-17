import { data, GetBatchResponse } from '@ampt/data';
import { IdGenerator } from '../../../../../shared/src/definitions/idGenerator';
import { ItemPink, itemSchema } from '../../../../../shared/src/definitions/itemPink';
import { amptDelimiter, delimiter } from '../../../../../shared/src/globalConstants';
import {
	CreateItemInput,
	ItemRepository
} from '../../../domain/definitions/repositories/ItemRepository';
import { batchResultSchema } from './batchResultSchema';

const getItemsSchema = batchResultSchema(itemSchema);

export class ItemRepositoryAmpt implements ItemRepository {
	private storageName = 'ITEM';
	private idGenerator;

	constructor(idGenerator: IdGenerator) {
		this.idGenerator = idGenerator;
	}

	private storageId(id: string): string {
		const idPart = `${this.storageName}${delimiter}${id}`;
		return `${idPart}${amptDelimiter}${idPart}}`;
	}

	async getItem(id: string): Promise<ItemPink | undefined> {
		const result = await data.get(this.storageId(id));
		const parsed = itemSchema.safeParse(result);
		if (parsed.success) {
			return parsed.data;
		}
		return undefined;
	}
	public async create(item: CreateItemInput): Promise<ItemPink | undefined> {
		const id = item.id ?? this.idGenerator.generate();
		const storageId = this.storageId(id);

		const result = await data.set(
			storageId,
			{ ...item, id },
			{ label5: `${this.storageName}S${amptDelimiter}${storageId.replace(':', ':')}` }
		);

		const resultA = await data.get(this.storageId(id), { meta: true });
		console.log(JSON.stringify(resultA));

		const parsed = itemSchema.safeParse(result);
		if (parsed.success) {
			return parsed.data;
		}
		return undefined;
	}

	async getAllItems(): Promise<ItemPink[] | undefined> {
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
				console.log('parsing failed with errors:', JSON.stringify(parsed.error));
				return undefined;
			}

			loaded = loaded.next ? ((await loaded.next()) as GetBatchResponse<unknown>) : undefined;
		}

		return result;
	}
}
