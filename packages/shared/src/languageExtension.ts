export type OptionalID<T> = Omit<T, 'id'> & { id?: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function forceExhaust(_input: never): never {
	throw new Error('can not be reached');
}

export type Result<Value> =
	| {
			success: true;
			value: Value;
	  }
	| {
			success: false;
			message: string;
			code: number;
	  };

export function success<T>(value: T): Result<T> {
	return { success: true, value };
}

export function failure<T>(message: string, code: number): Result<T> {
	return { success: false, message, code };
}
