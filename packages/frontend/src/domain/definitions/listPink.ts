import { z } from 'zod';

export const listPinkSchema = z.object({
	name: z.string(),
	itemIds: z.string().uuid().array(),
	id: z.string().uuid()
});

export type ListPink = z.infer<typeof listPinkSchema>;

export function createListPink(name: string, uuidGenerator: () => string): ListPink {
	return {
		id: uuidGenerator(),
		name: name,
		itemIds: []
	};
}
