import { IdGenerator } from '../../../../shared/src/definitions/idGenerator';
import { TokenChecker } from '../../../../shared/src/definitions/tokenChecker';
import { ConfigRepository } from './repositories/ConfigRepository';

export interface Dependencies {
	configRepository: ConfigRepository;
	idGenerator: IdGenerator;
	tokenChecker: TokenChecker;
}
