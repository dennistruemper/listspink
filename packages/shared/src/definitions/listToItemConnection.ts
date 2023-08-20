import { z } from 'zod';
export const listToItemConnectionSchema = z.object({
	itemId: z.string(),
	listId: z.string(),
	itemName: z.string(),
	itemDescription: z.string().optional(),
	itemCompleted: z.string().optional()
});
export type ListToItemConnection = z.infer<typeof listToItemConnectionSchema>;
