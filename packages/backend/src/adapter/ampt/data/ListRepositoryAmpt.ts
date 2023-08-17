import { data, GetBatchResponse } from '@ampt/data';
import { IdGenerator } from '../../../../../shared/src/definitions/idGenerator';
import { ListPink, listPinkSchema } from '../../../../../shared/src/definitions/listPink';
import { amptDelimiter, delimiter } from '../../../../../shared/src/globalConstants';
import {
	CreateListInput,
	ListRepository
} from '../../../domain/definitions/repositories/ListRepository';
import { batchResultSchema } from './batchResultSchema';

const getItemsSchema = batchResultSchema(listPinkSchema);

export class ListRepositoryAmpt implements ListRepository {
	private storageName = 'LIST';
	private idGenerator;

	constructor(idGenerator: IdGenerator) {
		this.idGenerator = idGenerator;
	}

	private storageId(id: string): string {
		const idPart = `${this.storageName}${delimiter}${id}`;
		return `${idPart}${amptDelimiter}${idPart}}`;
	}

	async getList(id: string): Promise<ListPink | undefined> {
		const result = await data.get(this.storageId(id));
		const parsed = listPinkSchema.safeParse(result);
		if (parsed.success) {
			return parsed.data;
		}
		return undefined;
	}
	public async create(list: CreateListInput): Promise<ListPink | undefined> {
		const id = list.id ?? this.idGenerator.generate();
		const storageId = this.storageId(id);

		const result = await data.set(
			storageId,
			{ ...list, id },
			{ label5: `${this.storageName}S${amptDelimiter}${storageId.replace(':', ':')}` }
		);

		const resultA = await data.get(this.storageId(id), { meta: true });
		console.log(JSON.stringify(resultA));

		const parsed = listPinkSchema.safeParse(result);
		if (parsed.success) {
			return parsed.data;
		}
		return undefined;
	}

	async getAllLists(): Promise<ListPink[] | undefined> {
		let loaded: GetBatchResponse<unknown> | undefined = await data.getByLabel(
			'label5',
			`${this.storageName}S${amptDelimiter}*`
		);
		const result: ListPink[] = [];

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
