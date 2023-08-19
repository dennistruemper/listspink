import { data, GetBatchResponse } from '@ampt/data';
import { IdGenerator } from '../../../../../shared/src/definitions/idGenerator';
import {
	ListPink,
	ListPinkDetails,
	listPinkSchema
} from '../../../../../shared/src/definitions/listPink';
import {
	UserToListConnection,
	userToListConnectionSchema
} from '../../../../../shared/src/definitions/userToListConnection';
import { amptDelimiter, delimiter } from '../../../../../shared/src/globalConstants';
import {
	failure,
	forceExhaust,
	Result,
	success
} from '../../../../../shared/src/languageExtension';
import {
	ConnectToUserErrors,
	ConnectToUserInput,
	CreateListInput,
	GetListsDetailsErrors,
	ListRepository,
	UserHasAccessErrors,
	UserHasAccessInput
} from '../../../domain/definitions/repositories/ListRepository';
import {
	DATA_MISSING_CODE,
	UNKNOWN_DATA_SHAPE,
	UNKNOWN_DATA_SHAPE_CODE
} from '../../../domain/errorCodes';
import { batchResultSchema } from './batchResultSchema';

const getListsSchema = batchResultSchema(listPinkSchema);
const getUserToListConnectionsSchema = batchResultSchema(userToListConnectionSchema);

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

	async getList(id: string): Promise<Result<ListPink | undefined, UNKNOWN_DATA_SHAPE>> {
		const result = await data.get(this.storageId(id));

		// it is ok to not find a list
		const optionalListSchema = listPinkSchema.optional();
		const parsed = optionalListSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}
	public async create(list: CreateListInput): Promise<Result<ListPink, UNKNOWN_DATA_SHAPE>> {
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
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	async getAllLists(): Promise<Result<ListPink[], UNKNOWN_DATA_SHAPE>> {
		let loaded: GetBatchResponse<unknown> | undefined = await data.getByLabel(
			'label5',
			`${this.storageName}S${amptDelimiter}*`
		);
		const result: ListPink[] = [];

		while (loaded) {
			const parsed = getListsSchema.safeParse(loaded);
			if (parsed.success) {
				result.push(...parsed.data.items.map((item) => item.value));
			} else {
				console.log('parsing failed with errors:', JSON.stringify(parsed.error));
				return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
			}

			loaded = loaded.next ? ((await loaded.next()) as GetBatchResponse<unknown>) : undefined;
		}

		return success(result);
	}

	async connectToUser(
		input: ConnectToUserInput
	): Promise<Result<UserToListConnection, ConnectToUserErrors>> {
		const listLoaded = await this.getList(input.listId);

		if (listLoaded.success === false) {
			switch (listLoaded.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					return failure('list not readable', listLoaded.code);
				default:
					forceExhaust(listLoaded.code);
			}
		}

		const list = listLoaded.value;

		if (list === undefined) {
			return failure(`List for id ${input.listId} does not exist`, DATA_MISSING_CODE);
		}

		const key = `USER${delimiter}${input.userId}:${this.storageName}${delimiter}${input.listId}`;
		const connectionDocument: UserToListConnection = {
			listName: list.name,
			listId: list.id,
			userId: input.userId,
			listDescription: list.description
		};

		const label1key = `DEPENDS_ON_LIST${delimiter}${input.listId}}${amptDelimiter}USER${delimiter}${input.userId}}}`;

		await data.set(key, connectionDocument, {
			label1: label1key,
			label5: `USER_HAS_LISTS${amptDelimiter}${key.replace(amptDelimiter, delimiter)}`
		});

		return success(connectionDocument);
	}

	async getListsDetailsForUser(
		userId: string
	): Promise<Result<ListPinkDetails[], GetListsDetailsErrors>> {
		const serachKey = `USER${delimiter}${userId}:${this.storageName}${delimiter}*`;

		const loaded = await data.get(serachKey);
		const parsed = getUserToListConnectionsSchema.safeParse(loaded);
		if (parsed.success === false) return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);

		function mapToResult(connection: UserToListConnection): ListPinkDetails {
			return {
				id: connection.listId,
				name: connection.listName,
				description: connection.listDescription
			};
		}

		const result = parsed.data.items.map((item) => mapToResult(item.value));

		return success(result);
	}

	async userHasAccess(input: UserHasAccessInput): Promise<Result<boolean, UserHasAccessErrors>> {
		const key = `USER${delimiter}${input.userId}:${this.storageName}${delimiter}${input.listId}`;
		const loaded = await data.get(key);

		if (loaded === undefined) {
			return success(false);
		}

		const parsed = userToListConnectionSchema.safeParse(loaded);
		if (parsed.success === false) return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);

		return success(true);
	}
}
