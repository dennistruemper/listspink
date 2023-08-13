import ksuid from 'ksuid';
import { IdGenerator } from '../definitions/idGenerator';

export class KsuidGenerator implements IdGenerator {
	public generate(): string {
		return generateId();
	}
}
function generateId(): string {
	return ksuid.randomSync().string;
}
