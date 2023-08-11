import { PUBLIC_STAGE } from '$env/static/public';
import { AuthRepositoryAuth0 } from './adapter/auth0/authRepositoryAuth0';
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
		authRepository: await AuthRepositoryAuth0.create({
			domain: 'listspink.eu.auth0.com',
			clientId: '0gCuLyMdGyU31BbgPXdnmofNCWREJAlu'
		})
	};
}

async function betaDependencies(): Promise<Dependencies> {
	return {
		uuidGenerator: UuidGenerator.v4,
		versionRepository: new VersionRepositoryBackend(),
		authRepository: await AuthRepositoryAuth0.create({
			domain: 'listspink-beta.eu.auth0.com',
			clientId: 'ipLY3EN3zHzl4zj9d6o38mTDYtgPDPe4'
		})
	};
}

async function devDependencies(): Promise<Dependencies> {
	return {
		uuidGenerator: UuidGenerator.v4,
		versionRepository: new VersionRepositoryBackend(),
		authRepository: await AuthRepositoryAuth0.create({
			domain: 'listspink-dev.eu.auth0.com',
			clientId: 'WVvNpcV9Fzoj3EWiYXtsdkiKDGfa5sCu'
		})
	};
}
