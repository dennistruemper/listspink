import { Result, failure, success } from '../../../languageExtension';
import { UpdateUserErrors, UserRepository } from '../../definitions/repositories/userRepository';

import { Usecase } from '../usecase';

export interface UpdateUserInput {
	userId: string;
	displayName: string;
}

export type UpdateUserOutput = {
	userId: string;
	displayName: string;
};

export class UpdateUserUsecase
	implements Usecase<UpdateUserInput, UpdateUserOutput, UpdateUserErrors>
{
	constructor(private readonly userRepository: UserRepository) {}

	async execute(data: UpdateUserInput): Promise<Result<UpdateUserOutput, UpdateUserErrors>> {
		const createResult = await this.userRepository.updateUser({
			id: data.userId,
			displayName: data.displayName
		});
		if (createResult.success === false) {
			return failure(createResult.message, createResult.code);
		}
		return success(data);
	}
}
