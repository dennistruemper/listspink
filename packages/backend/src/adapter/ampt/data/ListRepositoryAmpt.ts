import { data, GetBatchResponse } from '@ampt/data';
import { IdGenerator } from '../../../../../shared/src/definitions/idGenerator';
import { ListPink, listPinkSchema } from '../../../../../shared/src/definitions/listPink';
import { amptDelimiter, delimiter } from '../../../../../shared/src/globalConstants';
import { failure, Result, success } from '../../../../../shared/src/languageExtension';
import {
	CreateListInput,
	ListRepository
} from '../../../domain/definitions/repositories/ListRepository';
import { ErrorCodes } from '../../../domain/errorCodes';
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

	async getList(id: string): Promise<Result<ListPink | undefined>> {
		const result = await data.get(this.storageId(id));

		// it is ok to not find a list
		const optionalListSchema = listPinkSchema.optional();
		const parsed = optionalListSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', ErrorCodes.UNKNOWN_DATA_SHAPE);
	}
	public async create(list: CreateListInput): Promise<Result<ListPink>> {
		const id = list.id ?? this.idGenerator.generate();
		const storageId = this.storageId(id);

		const result = await data.set(
			storageId,
			{ ...list, id },
			{ label5: `${this.storageName}S${amptDelimiter}${storageId}` }
		);

		const parsed = listPinkSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', ErrorCodes.UNKNOWN_DATA_SHAPE);
	}

	async getAllLists(): Promise<Result<ListPink[]>> {
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
				return failure('unknown data shape', ErrorCodes.UNKNOWN_DATA_SHAPE);
			}

			loaded = loaded.next ? ((await loaded.next()) as GetBatchResponse<unknown>) : undefined;
		}

		return success(result);
	}
}
