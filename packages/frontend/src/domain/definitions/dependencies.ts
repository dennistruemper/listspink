import type { VersionRepository } from './versionRepository';

export interface Dependencies {
	uuidGenerator: () => string;
	versionRepository: VersionRepository;
}
