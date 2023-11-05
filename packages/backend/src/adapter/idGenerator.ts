import ksuid from 'ksuid';
import { IdGenerator } from '../domain/definitions/idGenerator';

export class KsuidGenerator implements IdGenerator {
	public generate(): string {
		return generateId();
	}
}
function generateId(): string {
	return ksuid.randomSync().string;
}
