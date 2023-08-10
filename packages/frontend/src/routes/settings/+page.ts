import { getDependencies } from '../../dependencies';
import type { PageLoad } from './$types';

export const load = (async () => {
	const versionRepository = getDependencies().versionRepository;
	const parsed = versionRepository.getVersion();
	return parsed;
}) satisfies PageLoad;
