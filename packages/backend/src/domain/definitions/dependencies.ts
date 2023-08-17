import { IdGenerator } from '../../../../shared/src/definitions/idGenerator';
import { ConfigRepository } from './repositories/ConfigRepository';

export interface Dependencies {
	configRepository: ConfigRepository;
	idGenerator: IdGenerator;
}
