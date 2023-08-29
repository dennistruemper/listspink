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

export const getItemResponseSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	id: z.string(),
	completed: z.string().optional()
});
export type GetItemsResponse = z.infer<typeof getItemResponseSchema>;

export const getItemsResponseSchema = getItemResponseSchema.array();

export const updateItemRequestSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		completed: z.string().optional()
	})
	.and(
		z
			.object({ name: z.string() })
			.or(z.object({ description: z.string() }))
			.or(z.object({ completed: z.string() }))
	);

export type UpdateItemRequest = z.infer<typeof updateItemRequestSchema>;
export type UpdateItemResponses = {
	// empty for now
};
