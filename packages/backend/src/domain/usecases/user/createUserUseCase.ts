import { Result, failure, success } from '../../../languageExtension';
import { UNKNOWN_DATA_SHAPE } from '../../definitions/errorCodes';
import { UserRepository } from '../../definitions/repositories/userRepository';

import { Usecase } from '../usecase';

export interface CreateUserInput {
	userId: string;
	displayName: string;
}

export type CreateUserOutput = {
	userId: string;
	displayName: string;
};

export class CreateUserUsecase
	implements Usecase<CreateUserInput, CreateUserOutput, UNKNOWN_DATA_SHAPE>
{
	constructor(private readonly userRepository: UserRepository) {}

	async execute(data: CreateUserInput): Promise<Result<CreateUserOutput, UNKNOWN_DATA_SHAPE>> {
		const createResult = await this.userRepository.createUser({
			id: data.userId,
			displayName: data.displayName
		});
		if (createResult.success === false) {
			return failure(createResult.message, createResult.code);
		}
		return success(data);
	}
}
