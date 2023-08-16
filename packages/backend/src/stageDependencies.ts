import ksuid from 'ksuid';
import { IdGenerator } from '../../shared/src/definitions/idGenerator';
import { ConfigRepositoryAmpt } from './adapter/ampt/configRepositoryAmpt';
import { Dependencies } from './domain/definitions/dependencies';

export function getDependencies(stage: string): Dependencies {
	switch (stage) {
		case 'beta':
			return betaDependencies;
		case 'prod':
			return prodDependencies;
		default:
			return devDependencies;
	}
}

class KsuidGenerator implements IdGenerator {
	generate(): string {
		return ksuid.randomSync().string;
	}
}

const devDependencies: Dependencies = {
	configRepository: new ConfigRepositoryAmpt(),
	idGenerator: new KsuidGenerator()
};
const betaDependencies: Dependencies = {
	configRepository: new ConfigRepositoryAmpt(),
	idGenerator: new KsuidGenerator()
};
const prodDependencies: Dependencies = {
	configRepository: new ConfigRepositoryAmpt(),
	idGenerator: new KsuidGenerator()
};
