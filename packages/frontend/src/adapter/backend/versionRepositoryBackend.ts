import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { versionResponseSchema } from '../../../../shared/src/definitions/versionRequestResponse';
import type { VersionRepository } from '../../domain/definitions/versionRepository';
import { parseResponse } from '../httpClient';

export class VersionRepositoryBackend implements VersionRepository {
	async getVersion(): Promise<
		{ success: true; data: { version: string } } | { success: false; error: string }
	> {
		const versionResponse: Response = await fetch(PUBLIC_BACKEND_URL + '/api/version');
		const parsed = parseResponse(await versionResponse.json(), versionResponseSchema);
		return parsed;
	}
}
