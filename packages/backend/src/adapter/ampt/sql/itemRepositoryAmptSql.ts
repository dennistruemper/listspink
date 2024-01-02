import {
	UNKNOWN_DATA_SHAPE,
	UNKNOWN_DATA_SHAPE_CODE
} from '../../../domain/definitions/errorCodes';
import { ItemPink, itemSchema } from '../../../domain/definitions/itemPink';
import {
	CreateItemErrors,
	CreateItemInput,
	GetAllItemsErrors,
	GetItemErrors,
	GetItemsForListInput,
	ItemRepository,
	UpdateItemInput
} from '../../../domain/definitions/repositories/itemRepository';
import { Result, failure, success } from '../../../languageExtension';
import { db } from './database';

export class ItemRepositoryAmptSql implements ItemRepository {
	async getItem(id: string): Promise<Result<ItemPink | undefined, GetItemErrors>> {
		const result = await db.selectFrom('todos').where('id', '=', id).selectAll().executeTakeFirst();

		if (result === undefined) {
			return success(undefined);
		}

		result.completed = result.completed ? new Date(result.completed) : result.completed;

		const parsed = itemSchema.optional().safeParse(result);

		if (parsed.success) {
			return success(parsed.data);
		}
		return failure(parsed.error.message, UNKNOWN_DATA_SHAPE_CODE);
	}
	public async create(item: CreateItemInput): Promise<Result<ItemPink, CreateItemErrors>> {
		const result = await db
			.insertInto('todos')
			.values({
				name: item.name,
				priority: item.priority ?? 0,
				listId: item.listId,
				description: item.description,
				completed: item.completed
			})
			.returningAll()
			.executeTakeFirst();

		const parsed = itemSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure(parsed.error.message, UNKNOWN_DATA_SHAPE_CODE);
	}

	async getAllItems(): Promise<Result<ItemPink[], GetAllItemsErrors>> {
		const result = await db.selectFrom('todos').selectAll().execute();

		return success(result);
	}

	async getItemsForList(
		input: GetItemsForListInput
	): Promise<Result<ItemPink[], GetAllItemsErrors>> {
		const loaded = await db
			.selectFrom('todos')
			.where('listId', '=', input.listId)
			.selectAll()
			.execute();

		const parsed = itemSchema.array().safeParse(loaded);
		if (parsed.success === false) {
			return failure(
				'parsing failed with errors:' + JSON.stringify(parsed.error),
				UNKNOWN_DATA_SHAPE_CODE
			);
		}
		return success(
			parsed.data.map((item) => {
				return {
					id: item.id,
					name: item.name,
					description: item.description,
					completed: item.completed,
					priority: item.priority,
					listId: item.listId
				};
			})
		);
	}

	async update(update: UpdateItemInput): Promise<Result<ItemPink, UNKNOWN_DATA_SHAPE>> {
		const resulta = db
			.updateTable('todos')
			.where('id', '=', update.itemId)
			.$if(update.updatedFields?.name !== undefined, (builder) =>
				builder.set({ name: update.updatedFields?.name ?? '' })
			)
			.$if(update.updatedFields?.description !== undefined, (builder) =>
				builder.set({ description: update.updatedFields?.description })
			)
			.$if(update.updatedFields?.priority !== undefined, (builder) =>
				builder.set({ priority: update.updatedFields?.priority ?? 0 })
			)
			.$if(update.updatedFields?.listId !== undefined, (builder) =>
				builder.set({ listId: update.updatedFields?.listId ?? '' })
			)
			.$if(update.updatedFields?.completed !== undefined, (builder) =>
				builder.set({ completed: update.updatedFields?.completed })
			)
			.returningAll();

		const result = await resulta.executeTakeFirst();

		if (result === undefined) {
			return failure('No Result from data source', UNKNOWN_DATA_SHAPE_CODE);
		}

		result.completed = result.completed ? new Date(result.completed) : result.completed;

		const parsed = itemSchema.optional().safeParse(result);

		if (parsed.success === false) {
			return failure(parsed.error.message, UNKNOWN_DATA_SHAPE_CODE);
		} else if (parsed.data === undefined) {
			return failure('No Result from data source', UNKNOWN_DATA_SHAPE_CODE);
		}

		return success(parsed.data);
	}
}
