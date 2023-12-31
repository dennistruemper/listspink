import { ConfigRepositoryAmpt } from './adapter/ampt/configRepositoryAmpt';
import { TokenCheckerClerk } from './adapter/clerk/tokenCheckerClerk';

import { ItemRepositoryAmptSql } from './adapter/ampt/sql/itemRepositoryAmptSql';
import { ListRepositoryAmptSql } from './adapter/ampt/sql/listRepositoryAmptSql';
import { UserRepositoryAmptSql } from './adapter/ampt/sql/userRepositoryAmptSql';
import { KsuidGenerator } from './adapter/ampt/util/ksuidGenerator';
import { UuidGenerator } from './adapter/ampt/util/uuidGenerator';
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
	const idGenerator = new UuidGenerator();
	const tokenChecker = new TokenCheckerClerk(configRepository);
	const listRepository = new ListRepositoryAmptSql();
	const itemRepository = new ItemRepositoryAmptSql();
	const userRepository = new UserRepositoryAmptSql();
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
	const listRepository = new ListRepositoryAmptSql();
	const itemRepository = new ItemRepositoryAmptSql();
	const userRepository = new UserRepositoryAmptSql();
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
	const listRepository = new ListRepositoryAmptSql();
	const itemRepository = new ItemRepositoryAmptSql();
	const userRepository = new UserRepositoryAmptSql();
	return {
		configRepository,
		idGenerator,
		tokenChecker,
		itemRepository,
		listRepository,
		userRepository
	};
}
