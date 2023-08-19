export type OptionalID<T> = Omit<T, 'id'> & { id?: string };

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
