import { z } from 'zod';

export const itemSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	completed: z.string().datetime({ offset: false }).nullable(),
	priority: z.number().optional(),
	listId: z.string()
});

export type ItemPink = z.infer<typeof itemSchema>;
