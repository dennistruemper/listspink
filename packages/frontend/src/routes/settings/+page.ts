import { getDependencies } from '../../dependencies';
import type { PageLoad } from './$types';

export const load = (async () => {
	const versionRepository = (await getDependencies()).versionRepository;
	const parsed = versionRepository.getVersion();
	return parsed;
}) satisfies PageLoad;
