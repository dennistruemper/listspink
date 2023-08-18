import { Result } from '../../../../shared/src/languageExtension';

export interface Usecase<T, R, E> {
	execute(params: T): Promise<Result<R, E>>;
}
