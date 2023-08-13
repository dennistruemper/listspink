export type OptionalID<T> = Omit<T, 'id'> & { id?: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function forceExhaust(_input: never): never {
	throw new Error('can not be reached');
}
