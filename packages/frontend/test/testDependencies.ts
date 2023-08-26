import { Result, success } from '../../shared/src/languageExtension';
import { UuidGenerator } from '../src/adapter/uuid';
import type { AuthRepository } from '../src/domain/definitions/authRepository';
import type { Dependencies } from '../src/domain/definitions/dependencies';
import {
	CreateItemInput,
	GetItemsForListInput,
	GetItemsForListResponse,
	ItemRepository
} from '../src/domain/definitions/repositories/itemRepository';
import {
	CreateListInput,
	GetListsForUser,
	ListRepository
} from '../src/domain/definitions/repositories/listRepository';
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
	getAccessToken(): Promise<string | undefined> {
		return Promise.resolve('fakeAccessToken');
	}
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

class ListRepositoryFake implements ListRepository {
	getAll(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_data: GetListsForUser
	): Promise<
		Result<{ name: string; id: string; itemIds: string[]; description?: string | undefined }[], 2>
	> {
		return Promise.resolve(success([]));
	}
	create(
		data: CreateListInput
	): Promise<
		Result<{ name: string; id: string; itemIds: string[]; description?: string | undefined }, 2>
	> {
		return Promise.resolve({
			success: true,
			value: { id: 'fakeId', itemIds: [], description: data.description, name: data.name }
		});
	}
}

class ItemRepositoryFake implements ItemRepository {
	create(data: CreateItemInput): Promise<
		Result<
			{
				name: string;
				id: string;
				description?: string | undefined;
				completed?: string | undefined;
			},
			2
		>
	> {
		return Promise.resolve({
			success: true,
			value: {
				id: 'fakeId',
				description: data.description,
				name: data.name
			}
		});
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getAll(_data: GetItemsForListInput): Promise<Result<GetItemsForListResponse, 2>> {
		return Promise.resolve(success({ items: [] }));
	}
}

export const defaultTestDependencies: Dependencies = {
	uuidGenerator: UuidGenerator.v4,
	listRepository: new ListRepositoryFake(),
	itemRepository: new ItemRepositoryFake(),
	versionRepository: new VersionRepositoryFake(),
	authRepository: new AuthRepositoryFake()
};
