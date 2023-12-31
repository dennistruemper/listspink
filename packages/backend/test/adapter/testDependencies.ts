import { ConfigRepositoryAmpt } from '../../src/adapter/ampt/configRepositoryAmpt';
import { ItemRepositoryAmptSql } from '../../src/adapter/ampt/sql/itemRepositoryAmptSql';
import { ListRepositoryAmptSql } from '../../src/adapter/ampt/sql/listRepositoryAmptSql';
import { UserRepositoryAmptSql } from '../../src/adapter/ampt/sql/userRepositoryAmptSql';
import { UuidGenerator } from '../../src/adapter/ampt/util/uuidGenerator';
import { Dependencies } from '../../src/domain/definitions/dependencies';
import { TokenCheckerFake } from '../util/tokenCheckerFake';

export function getTestDependencies(stage: 'integration'): Dependencies {
	switch (stage) {
		case 'integration':
		default:
			return integrationDependencies();
	}
}

function integrationDependencies(): Dependencies {
	console.log('integrationTestDependencies loaded');
	const configRepository = new ConfigRepositoryAmpt();
	const idGenerator = new UuidGenerator();
	const tokenChecker = new TokenCheckerFake();
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
