import { ConfigRepositoryAmpt } from './adapter/ampt/configRepositoryAmpt';
import { ItemRepositoryAmpt } from './adapter/ampt/data/itemRepositoryAmpt';
import { ListRepositoryAmpt } from './adapter/ampt/data/listRepositoryAmpt';
import { TokenCheckerClerk } from './adapter/clerk/tokenCheckerClerk';

import { UserRepositoryAmpt } from './adapter/ampt/data/userRepositoryAmpt';
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
	const userRepository = new UserRepositoryAmpt();
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		itemRepository,
		listRepository,
		userRepository
	};
}

function betaDependencies(): Dependencies {
	console.log('betaDependencies loaded');
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerClerk(configRepository);
	const listRepository = new ListRepositoryAmpt(idGenerator);
	const itemRepository = new ItemRepositoryAmpt(idGenerator);
	const userRepository = new UserRepositoryAmpt();
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		itemRepository,
		listRepository,
		userRepository
	};
}

function prodDependencies(): Dependencies {
	console.log('prodDependencies loaded');
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new KsuidGenerator();
	const tokenChecker = new TokenCheckerClerk(configRepository);
	const listRepository = new ListRepositoryAmpt(idGenerator);
	const itemRepository = new ItemRepositoryAmpt(idGenerator);
	const userRepository = new UserRepositoryAmpt();
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		itemRepository,
		listRepository,
		userRepository
	};
}
