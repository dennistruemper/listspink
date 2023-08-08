import { UuidGenerator } from '../src/adapter/uuid';
import type { Dependencies } from '../src/domain/definitions/dependencies';
import type { VersionRepository } from '../src/domain/definitions/versionRepository';

class VersionRepositoryFake implements VersionRepository {
	async getVersion(): Promise<
		{ success: true; data: { version: string } } | { success: false; error: string }
	> {
		return { success: true, data: { version: 'v0.0.1' } };
	}
}

export const defaultTestDependencies: Dependencies = {
	uuidGenerator: UuidGenerator.v4,
	versionRepository: new VersionRepositoryFake()
};
