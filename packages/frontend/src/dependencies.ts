import { UuidGenerator } from './adapter/uuid';
import type { Dependencies } from './domain/definitions/dependencies';

export const prodDependencies: Dependencies = {
	uuidGenerator: UuidGenerator.v4
};
