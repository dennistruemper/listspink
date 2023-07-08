import { UuidGenerator } from '../src/adapter/uuid';
import type { Dependencies } from '../src/domain/definitions/dependencies';

export const defaultTestDependencies: Dependencies = {
	uuidGenerator: UuidGenerator.v4
};
