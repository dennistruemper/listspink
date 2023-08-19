import ksuid from 'ksuid';
import { IdGenerator } from '../../shared/src/definitions/idGenerator';
import { TokenCheckerFake } from '../test/util/tokenCheckerFake';
import { ConfigRepositoryAmpt } from './adapter/ampt/configRepositoryAmpt';
import { ListRepositoryAmpt } from './adapter/ampt/data/ListRepositoryAmpt';
import { TokenCheckerAuth0 } from './adapter/auth0/tokenCheckerAuth0';
import { Dependencies } from './domain/definitions/dependencies';

export function getDependencies(stage: string): Dependencies {
	switch (stage) {
		case 'test':
			return testDependencies();
		case 'beta':
			return betaDependencies();
		case 'prod':
			return prodDependencies();
		default:
			return devDependencies();
	}
}

class KsuidGenerator implements IdGenerator {
	generate(): string {
		return ksuid.randomSync().string;
	}
}

function testDependencies(): Dependencies {
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerFake();
	const listRepository = new ListRepositoryAmpt(idGenerator);
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		listRepository
	};
}

function devDependencies(): Dependencies {
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerAuth0(configRepository);
	const listRepository = new ListRepositoryAmpt(idGenerator);
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		listRepository
	};
}

function betaDependencies(): Dependencies {
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerAuth0(configRepository);
	const listRepository = new ListRepositoryAmpt(idGenerator);
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		listRepository
	};
}

function prodDependencies(): Dependencies {
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerAuth0(configRepository);
	const listRepository = new ListRepositoryAmpt(idGenerator);
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		listRepository
	};
}
