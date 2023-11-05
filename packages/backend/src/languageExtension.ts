export type OptionalID<T> = Omit<T, 'id'> & { id?: string };
export type AtLeastOne<T> = AtLeastOneHelper<Required<T>>;
type AtLeastOneHelper<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
export type UpdateInput<T> = UpdateInputHelper<Required<Nullable<T>>>;
type UpdateInputHelper<T, U = { [K in keyof T]: Pick<T, K> }> = (Partial<T> & U[keyof U]) | null;
export type Nullable<T> = { [P in keyof T]: T[P] | null };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function forceExhaust(_input: never): never {
	throw new Error('can not be reached');
}

export type Result<Value, ErrorCodes> =
	| {
			success: true;
			value: Value;
	  }
	| {
			success: false;
			message: string;
			code: ErrorCodes;
	  };

export function success<T, E>(value: T): Result<T, E> {
	return { success: true, value };
}

export function failure<T, E>(message: string, code: E): Result<T, E> {
	return { success: false, message, code };
}
