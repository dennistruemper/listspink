import { data } from '@ampt/data';
import { UNKNOWN_DATA_SHAPE_CODE } from '../../../domain/definitions/errorCodes';
import {
	CreateUserErrors,
	GetUserErrors,
	UpdateUserErrors,
	UpdateUserInput,
	UserRepository
} from '../../../domain/definitions/repositories/userRepository';
import { User, userSchema } from '../../../domain/definitions/user';
import { amptDelimiter, delimiter } from '../../../globalConstants';
import { Result, failure, success } from '../../../languageExtension';

export class UserRepositoryAmpt implements UserRepository {
	private storageName = 'USER';

	async getUser(id: string): Promise<Result<User, GetUserErrors>> {
		const storageId = this.storageId(id);

		const result = await data.get(storageId);

		const parsed = userSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	async createUser(user: User): Promise<Result<User, CreateUserErrors>> {
		const id = user.id;
		const storageId = this.storageId(id);

		const result = await data.set(
			storageId,
			{ ...user },
			{ label5: `${this.storageName}S${amptDelimiter}${storageId}` }
		);

		const parsed = userSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	async updateUser(input: UpdateUserInput): Promise<Result<User | undefined, UpdateUserErrors>> {
		const id = input.id;
		const storageId = this.storageId(id);

		const result = await data.set(storageId, { ...input });

		const parsed = userSchema.safeParse(result);
		if (parsed.success) {
			return success(parsed.data);
		}
		return failure('unknown data shape', UNKNOWN_DATA_SHAPE_CODE);
	}

	private storageId(id: string): string {
		const idPart = `${this.storageName}${delimiter}${id}`;
		return `${idPart}${amptDelimiter}${idPart}`;
	}
}
