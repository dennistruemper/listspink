import { IdGenerator } from '../../../../shared/src/definitions/idGenerator';
import { TokenChecker } from '../../../../shared/src/definitions/tokenChecker';
import { ConfigRepository } from './repositories/configRepository';
import { ItemRepository } from './repositories/itemRepository';
import { ListRepository } from './repositories/listRepository';

export interface Dependencies {
	configRepository: ConfigRepository;
	idGenerator: IdGenerator;
	tokenChecker: TokenChecker;
	listRepository: ListRepository;
	itemRepository: ItemRepository;
}
