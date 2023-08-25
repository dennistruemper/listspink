import ksuid from 'ksuid';
import { IdGenerator } from '../../../../../shared/src/definitions/idGenerator';

export class KsuidGenerator implements IdGenerator {
	generate(): string {
		return ksuid.randomSync().string;
	}
}
