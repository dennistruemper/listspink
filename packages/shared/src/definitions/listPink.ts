import { z } from 'zod';

export const listPinkDetailsSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	id: z.string()
});
export type ListPinkDetails = z.infer<typeof listPinkDetailsSchema>;

export const listPinkSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	id: z.string(),
	itemIds: z.string().array().optional().default([])
});

export type ListPink = z.infer<typeof listPinkSchema>;

export function createListPink(name: string, uuidGenerator: () => string): ListPink {
	return {
		id: uuidGenerator(),
		name: name,
		itemIds: []
	};
}
