import type { AuthRepository } from './authRepository';
import type { ListRepository } from './repositories/listRepository';
import type { VersionRepository } from './versionRepository';

export interface Dependencies {
	uuidGenerator: () => string;
	versionRepository: VersionRepository;
	listRepository: ListRepository;
	authRepository: AuthRepository;
}
