import { v4 } from 'uuid';
export class UuidGenerator {
	static v4(): string {
		return v4();
	}
}
