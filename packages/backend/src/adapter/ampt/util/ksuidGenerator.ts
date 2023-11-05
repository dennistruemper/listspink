import ksuid from 'ksuid';
import { IdGenerator } from '../../../domain/definitions/idGenerator';

export class KsuidGenerator implements IdGenerator {
	generate(): string {
		return ksuid.randomSync().string;
	}
}
