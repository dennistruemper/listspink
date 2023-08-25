import { PUBLIC_STAGE } from '$env/static/public';
import { AuthRepositoryClerk } from './adapter/authRepositoryClerk';
import { ListRepositoryBackend } from './adapter/backend/listRepositoryBackend';
import { VersionRepositoryBackend } from './adapter/backend/versionRepositoryBackend';
import { UuidGenerator } from './adapter/uuid';
import type { Dependencies } from './domain/definitions/dependencies';

export async function getDependencies(): Promise<Dependencies> {
	const stage = PUBLIC_STAGE;
	if (stage === 'prod') {
		return await prodDependencies();
	}
	if (stage === 'beta') {
		return await betaDependencies();
	}
	return await devDependencies();
}

async function prodDependencies(): Promise<Dependencies> {
	return {
		uuidGenerator: UuidGenerator.v4,
		versionRepository: new VersionRepositoryBackend(),
		listRepository: new ListRepositoryBackend(),
		authRepository: await AuthRepositoryClerk.create({
			frontendApi: 'pk_live_Y2xlcmsubGlzdHMucGluayQ'
		})
	};
}

async function betaDependencies(): Promise<Dependencies> {
	return {
		uuidGenerator: UuidGenerator.v4,
		versionRepository: new VersionRepositoryBackend(),
		listRepository: new ListRepositoryBackend(),
		authRepository: await AuthRepositoryClerk.create({
			frontendApi: 'pk_test_aGFyZHktZ2xpZGVyLTIwLmNsZXJrLmFjY291bnRzLmRldiQ'
		})
	};
}

async function devDependencies(): Promise<Dependencies> {
	return {
		uuidGenerator: UuidGenerator.v4,
		versionRepository: new VersionRepositoryBackend(),
		listRepository: new ListRepositoryBackend(),
		authRepository: await AuthRepositoryClerk.create({
			frontendApi: 'pk_test_aGFyZHktZ2xpZGVyLTIwLmNsZXJrLmFjY291bnRzLmRldiQ'
		})
	};
}
