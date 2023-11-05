import { IdGenerator } from './idGenerator';
import { ConfigRepository } from './repositories/configRepository';
import { ItemRepository } from './repositories/itemRepository';
import { ListRepository } from './repositories/listRepository';
import { TokenChecker } from './tokenChecker';

export interface Dependencies {
	configRepository: ConfigRepository;
	idGenerator: IdGenerator;
	tokenChecker: TokenChecker;
	listRepository: ListRepository;
	itemRepository: ItemRepository;
}
