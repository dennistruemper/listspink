import ksuid from 'ksuid';
import { IdGenerator } from '../../shared/src/definitions/idGenerator';
import { TokenCheckerFake } from '../test/util/tokenCheckerFake';
import { ConfigRepositoryAmpt } from './adapter/ampt/configRepositoryAmpt';
import { ItemRepositoryAmpt } from './adapter/ampt/data/ItemRepositoryAmpt';
import { ListRepositoryAmpt } from './adapter/ampt/data/ListRepositoryAmpt';
import { TokenCheckerClerk } from './adapter/clerk/tokenCheckerClerk';

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
	console.log('testDependencies loaded');
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerFake();
	const listRepository = new ListRepositoryAmpt(idGenerator);
	const itemRepository = new ItemRepositoryAmpt(idGenerator);
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		itemRepository,
		listRepository
	};
}

function devDependencies(): Dependencies {
	console.log('devDependencies loaded');
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerClerk(configRepository);
	const listRepository = new ListRepositoryAmpt(idGenerator);
	const itemRepository = new ItemRepositoryAmpt(idGenerator);
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		itemRepository,
		listRepository
	};
}

function betaDependencies(): Dependencies {
	console.log('betaDependencies loaded');
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerClerk(configRepository);
	const listRepository = new ListRepositoryAmpt(idGenerator);
	const itemRepository = new ItemRepositoryAmpt(idGenerator);
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		itemRepository,
		listRepository
	};
}

function prodDependencies(): Dependencies {
	console.log('prodDependencies loaded');
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerClerk(configRepository);
	const listRepository = new ListRepositoryAmpt(idGenerator);
	const itemRepository = new ItemRepositoryAmpt(idGenerator);
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		itemRepository,
		listRepository
	};
}
