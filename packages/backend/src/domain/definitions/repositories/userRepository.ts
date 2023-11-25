import { Result } from '../../../languageExtension';
import { DATA_MISSING, UNKNOWN_DATA_SHAPE } from '../errorCodes';
import { User } from '../user';

export type CreateUserInput = User;
export type UpdateUserInput = User;

export type GetUserErrors = UNKNOWN_DATA_SHAPE | DATA_MISSING;
export type CreateUserErrors = UNKNOWN_DATA_SHAPE;
export type UpdateUserErrors = UNKNOWN_DATA_SHAPE | DATA_MISSING;

export interface UserRepository {
	getUser(id: string): Promise<Result<User, GetUserErrors>>;
	createUser(user: CreateUserInput): Promise<Result<User, CreateUserErrors>>;
	updateUser(input: UpdateUserInput): Promise<Result<User | undefined, UpdateUserErrors>>;
}
