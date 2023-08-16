import { z } from 'zod';

export const listPinkSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	itemIds: z.string().array(),
	id: z.string()
});

export type ListPink = z.infer<typeof listPinkSchema>;

export function createListPink(name: string, uuidGenerator: () => string): ListPink {
	return {
		id: uuidGenerator(),
		name: name,
		itemIds: []
	};
}
