import z from 'zod';

export const createItemRequestSchema = z.object({
	listId: z.string(),
	extraListIds: z.array(z.string()).optional(),
	name: z.string(),
	description: z.string().nullable(),
	priority: z.number().default(0)
});
export type CreateItemRequest = z.infer<typeof createItemRequestSchema>;

export const createItemResponseSchema = z.object({ id: z.string() }).and(createItemRequestSchema);
export type CreateItemResponse = z.infer<typeof createItemResponseSchema>;

export const getItemResponseSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	id: z.string(),
	completed: z.string().nullable(),
	priority: z.number().default(0)
});
export type GetItemsResponse = z.infer<typeof getItemResponseSchema>;

export const getItemsResponseSchema = getItemResponseSchema.array();

export const updateItemRequestSchema = z.object({
	name: z.string().nullish(),
	description: z.string().nullish(),
	completed: z.string().nullish(),
	priority: z.number().default(0)
});

export const updateItemResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable()
});

export type UpdateItemRequest = z.infer<typeof updateItemRequestSchema>;

export type UpdateItemResponses = z.infer<typeof updateItemResponseSchema>;
