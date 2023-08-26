import z from 'zod';

export const createItemRequestSchema = z.object({
	listId: z.string(),
	extraListIds: z.array(z.string()).optional(),
	name: z.string(),
	description: z.string().optional()
});
export type CreateItemRequest = z.infer<typeof createItemRequestSchema>;

export const createItemResponseSchema = z.object({ id: z.string() }).and(createItemRequestSchema);
export type CreateItemResponse = z.infer<typeof createItemResponseSchema>;

export const getItemsResponseSchema = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		id: z.string(),
		completed: z.string().optional()
	})
	.array();
