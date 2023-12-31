import { DATA_MISSING_CODE, UNKNOWN_DATA_SHAPE_CODE } from '../../../domain/definitions/errorCodes';
import {
	ListPink,
	ListPinkDetails,
	listPinkSchema,
	listsPinkSchema
} from '../../../domain/definitions/listPink';
import { ListToItemConnection } from '../../../domain/definitions/listToItemConnection';
import {
	ConnectItemToListErrors,
	ConnectItemToListInput,
	ConnectToUserErrors,
	ConnectToUserInput,
	CreateListErrors,
	CreateListInput,
	GetAllListsErrors,
	GetListErrors,
	GetListsByItemIdForUserErrors,
	GetListsByItemIdForUserInput,
	GetListsDetailsErrors,
	ListRepository,
	UserHasAccessErrors,
	UserHasAccessInput
} from '../../../domain/definitions/repositories/listRepository';
import { UserToListConnection } from '../../../domain/definitions/userToListConnection';
import { Result, failure, success } from '../../../languageExtension';
import { db } from './database';

export class ListRepositoryAmptSql implements ListRepository {
	async getList(id: string): Promise<Result<ListPink | undefined, GetListErrors>> {
		const result = await db.selectFrom('lists').where('id', '=', id).selectAll().executeTakeFirst();

		if (result === undefined) {
			return success(undefined);
		}

		const parsed = listPinkSchema.optional().safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	public async create(list: CreateListInput): Promise<Result<ListPink, CreateListErrors>> {
		const result = await db
			.insertInto('lists')
			.values({ description: list.description, name: list.name })
			.returningAll()
			.executeTakeFirst();

		const parsed = listPinkSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	async getAllLists(): Promise<Result<ListPink[], GetAllListsErrors>> {
		const result = await db.selectFrom('lists').selectAll().execute();

		const parsed = listsPinkSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}

		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	async connectToUser(
		input: ConnectToUserInput
	): Promise<Result<UserToListConnection, ConnectToUserErrors>> {
		try {
			const result = await db
				.insertInto('userLists')
				.values({ listId: input.listId, userId: input.userId })
				.returningAll()
				.executeTakeFirst();

			if (result === undefined) {
				return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
			}
			return success({ listId: result.listId, userId: result.userId });
		} catch (e) {
			console.log(e);
			return failure(`data missing: ${e.detail}`, DATA_MISSING_CODE);
		}
	}

	async getListsDetailsForUser(
		userId: string
	): Promise<Result<ListPinkDetails[], GetListsDetailsErrors>> {
		const result = await db
			.selectFrom('lists')
			.innerJoin('userLists', 'lists.id', 'userLists.listId')
			.where('userLists.userId', '=', userId)
			.select(['lists.id as id', 'lists.name as name', 'lists.description as description'])
			.execute();

		const parsed = listsPinkSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}

		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	async userHasAccess(input: UserHasAccessInput): Promise<Result<boolean, UserHasAccessErrors>> {
		const result = await db
			.selectFrom('userLists')
			.where('userLists.userId', '=', input.userId)
			.where('userLists.listId', '=', input.listId)
			.selectAll()
			.executeTakeFirst();

		return success(result !== undefined);
	}

	async connectItemToList(
		input: ConnectItemToListInput
	): Promise<Result<ListToItemConnection, ConnectItemToListErrors>> {
		const result = await db
			.updateTable('todos')
			.set({ listId: input.listId })
			.where('id', '=', input.itemId)
			.returningAll()
			.execute();
		return success({
			itemCompleted: '',
			itemId: '',
			itemName: '',
			listId: '',
			priority: 0,
			itemDescription: null,
			completed: undefined
		});
	}

	async getListsByItemIdForUser(
		input: GetListsByItemIdForUserInput
	): Promise<Result<ListPinkDetails[], GetListsByItemIdForUserErrors>> {
		console.log('load lists');
		const result = await db
			.selectFrom('lists')
			.innerJoin('todos', 'lists.id', 'todos.listId')
			.innerJoin('userLists', 'lists.id', 'userLists.listId')
			.where('todos.id', '=', input.itemId)
			.where('userLists.userId', '=', input.userId)
			.select(['lists.id as id', 'lists.name as name', 'lists.description as description'])
			.execute();
		console.log('loaded lists', result);

		const parsed = listsPinkSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}

		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}
}
