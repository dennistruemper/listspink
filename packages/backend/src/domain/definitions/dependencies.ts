import { IdGenerator } from '../../../../shared/src/definitions/idGenerator';
import { TokenChecker } from '../../../../shared/src/definitions/tokenChecker';
import { ConfigRepository } from './repositories/ConfigRepository';
import { ListRepository } from './repositories/ListRepository';
import { ItemRepository } from './repositories/itemRepository';

export interface Dependencies {
	configRepository: ConfigRepository;
	idGenerator: IdGenerator;
	tokenChecker: TokenChecker;
	listRepository: ListRepository;
	itemRepository: ItemRepository;
}
