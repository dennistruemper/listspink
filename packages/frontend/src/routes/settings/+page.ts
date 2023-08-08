import { prodDependencies } from '../../dependencies';
import type { PageLoad } from './$types';

export const load = (async () => {
	const versionRepository = prodDependencies.versionRepository;
	const parsed = versionRepository.getVersion();
	return parsed;
}) satisfies PageLoad;
