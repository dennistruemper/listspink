import { PUBLIC_STAGE } from '$env/static/public';
import { AuthRepositoryAuth0 } from './adapter/auth0/authRepositoryAuth0';
import { VersionRepositoryBackend } from './adapter/backend/versionRepositoryBackend';
import { UuidGenerator } from './adapter/uuid';
import type { Dependencies } from './domain/definitions/dependencies';

export function getDependencies(): Dependencies {
	const stage = PUBLIC_STAGE;
	if (stage === 'prod') return prodDependencies;
	if (stage === 'beta') return betaDependencies;
	return devDependencies;
}

const prodDependencies: Dependencies = {
	uuidGenerator: UuidGenerator.v4,
	versionRepository: new VersionRepositoryBackend(),
	authRepository: await AuthRepositoryAuth0.create({
		domain: 'listspink.eu.auth0.com',
		clientId: '0gCuLyMdGyU31BbgPXdnmofNCWREJAlu'
	})
};

const betaDependencies: Dependencies = {
	uuidGenerator: UuidGenerator.v4,
	versionRepository: new VersionRepositoryBackend(),
	authRepository: await AuthRepositoryAuth0.create({
		domain: 'listspink-beta.eu.auth0.com',
		clientId: 'ipLY3EN3zHzl4zj9d6o38mTDYtgPDPe4'
	})
};

const devDependencies: Dependencies = {
	uuidGenerator: UuidGenerator.v4,
	versionRepository: new VersionRepositoryBackend(),
	authRepository: await AuthRepositoryAuth0.create({
		domain: 'listspink-dev.eu.auth0.com',
		clientId: 'WVvNpcV9Fzoj3EWiYXtsdkiKDGfa5sCu'
	})
};
