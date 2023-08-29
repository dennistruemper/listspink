import { ConfigRepositoryAmpt } from '../../src/adapter/ampt/configRepositoryAmpt';
import { ItemRepositoryAmpt } from '../../src/adapter/ampt/data/itemRepositoryAmpt';
import { ListRepositoryAmpt } from '../../src/adapter/ampt/data/listRepositoryAmpt';
import { KsuidGenerator } from '../../src/adapter/ampt/util/ksuidGenerator';
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
