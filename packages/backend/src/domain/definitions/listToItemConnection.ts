import { z } from 'zod';
export const listToItemConnectionSchema = z.object({
	itemId: z.string(),
	listId: z.string(),
	itemName: z.string(),
	itemDescription: z.string().nullable(),
	itemCompleted: z.string().nullable(),
	completed: z.string().optional(),
	priority: z.number().default(0)
});
export type ListToItemConnection = z.infer<typeof listToItemConnectionSchema>;
