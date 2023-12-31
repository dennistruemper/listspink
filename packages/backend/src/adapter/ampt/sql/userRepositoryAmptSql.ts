import { UNKNOWN_DATA_SHAPE_CODE } from '../../../domain/definitions/errorCodes';
import {
	CreateUserErrors,
	CreateUserInput,
	GetUserErrors,
	UpdateUserErrors,
	UpdateUserInput,
	UserRepository
} from '../../../domain/definitions/repositories/userRepository';
import { User, userSchema } from '../../../domain/definitions/user';
import { Result, failure, success } from '../../../languageExtension';
import { db } from './database';

export class UserRepositoryAmptSql implements UserRepository {
	async getUser(id: string): Promise<Result<User, GetUserErrors>> {
		const result = await db.selectFrom('users').where('id', '=', id).selectAll().executeTakeFirst();

		const parsed = userSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	async createUser(input: CreateUserInput): Promise<Result<User, CreateUserErrors>> {
		const result = await db
			.insertInto('users')
			.values({ displayName: input.displayName, id: input.id })
			.returningAll()
			.executeTakeFirst();

		const parsed = userSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	async updateUser(input: UpdateUserInput): Promise<Result<User | undefined, UpdateUserErrors>> {
		const result = await db
			.updateTable('users')
			.set({ displayName: input.displayName })
			.where('id', '=', input.id)
			.returningAll()
			.executeTakeFirst();

		const parsed = userSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}
}
