import { z } from 'zod';

export function batchResultSchema<T extends z.AnyZodObject>(schema: T) {
	return z.object({
		items: z.object({ value: schema }).array(),
		lastKey: z.string().optional(),
		next: z.function().optional()
	});
}
