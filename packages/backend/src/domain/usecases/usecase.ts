import { Result } from '../../../../shared/src/languageExtension';

export interface Usecase<T, R> {
	execute(params: T): Promise<Result<R>>;
}
