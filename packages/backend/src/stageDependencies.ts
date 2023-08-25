import { ConfigRepositoryAmpt } from './adapter/ampt/configRepositoryAmpt';
import { ItemRepositoryAmpt } from './adapter/ampt/data/ItemRepositoryAmpt';
import { ListRepositoryAmpt } from './adapter/ampt/data/ListRepositoryAmpt';
import { TokenCheckerClerk } from './adapter/clerk/tokenCheckerClerk';

import { KsuidGenerator } from './adapter/ampt/util/ksuidGenerator';
import { Dependencies } from './domain/definitions/dependencies';

export function getProdDependencies(stage: string): Dependencies {
	switch (stage) {
		case 'beta':
			return betaDependencies();
		case 'prod':
			return prodDependencies();
		default:
			return devDependencies();
	}
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
