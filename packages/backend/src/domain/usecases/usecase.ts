import { Result } from '../../languageExtension';

export interface Usecase<T, R, E> {
	execute(params: T): Promise<Result<R, E>>;
}
