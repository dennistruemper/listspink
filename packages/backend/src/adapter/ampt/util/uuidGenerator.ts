import { randomUUID } from 'crypto';
import { IdGenerator } from '../../../domain/definitions/idGenerator';

export class UuidGenerator implements IdGenerator {
	generate(): string {
		return randomUUID();
	}
}
