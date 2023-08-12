import { UuidGenerator } from '../src/adapter/uuid';
import type { AuthRepository } from '../src/domain/definitions/authRepository';
import type { Dependencies } from '../src/domain/definitions/dependencies';
import type { User } from '../src/domain/definitions/user';
import type { VersionRepository } from '../src/domain/definitions/versionRepository';

class VersionRepositoryFake implements VersionRepository {
	async getVersion(): Promise<
		{ success: true; data: { version: string } } | { success: false; error: string }
	> {
		return { success: true, data: { version: 'v0.0.1' } };
	}
}

class AuthRepositoryFake implements AuthRepository {
	handleRedirectCallback(url: string): Promise<void> {
		throw new Error('Method not implemented.' + url);
	}
	login(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	logout(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	isAuthenticated(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	getUser(): Promise<User | undefined> {
		throw new Error('Method not implemented.');
	}
}

export const defaultTestDependencies: Dependencies = {
	uuidGenerator: UuidGenerator.v4,
	versionRepository: new VersionRepositoryFake(),
	authRepository: new AuthRepositoryFake()
};